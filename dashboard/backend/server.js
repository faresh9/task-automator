const express = require('express');
const cors = require('cors');
const axios = require('axios');
const morgan = require('morgan');
const { db, initializeDatabase } = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize SQLite database
(async () => {
  try {
    await initializeDatabase();
    console.log('SQLite database initialized');
  } catch (err) {
    console.error('SQLite initialization error:', err);
    process.exit(1);
  }
})();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// n8n API Configuration and helper function
const N8N_API_URL = process.env.N8N_API_URL || 'http://localhost:5678';
const N8N_API_KEY = process.env.N8N_API_KEY;

// Helper function for n8n API requests with better error handling
async function n8nApiRequest(method, endpoint, data = null, params = {}) {
  try {
    const config = {
      method,
      url: `${N8N_API_URL}/api/v1/${endpoint}`,
      headers: { 
        'X-N8N-API-KEY': N8N_API_KEY,
        'Accept': 'application/json'
      },
      params
    };
    
    if (data) {
      config.data = data;
      config.headers['Content-Type'] = 'application/json';
    }
    
    console.log(`Making ${method} request to n8n: ${endpoint}`);
    const response = await axios(config);
    return response.data;
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const message = error.response.data?.message || 'Unknown API error';
      
      if (status === 401) {
        throw new Error('Authentication failed: Invalid API key');
      } else if (status === 404) {
        throw new Error(`Resource not found: ${endpoint}`);
      } else {
        throw new Error(`n8n API error (${status}): ${message}`);
      }
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from n8n server. Check if n8n is running.');
    } else {
      // Something happened in setting up the request
      throw new Error(`Request setup error: ${error.message}`);
    }
  }
}

// Test n8n connectivity on startup
(async () => {
  try {
    await n8nApiRequest('GET', 'workflows', null, { limit: 1 });
    console.log('Successfully connected to n8n API');
  } catch (error) {
    console.warn(`⚠️ Could not connect to n8n: ${error.message}`);
    console.warn('Dashboard will operate with limited functionality');
  }
})();

// Routes for n8n workflow data - FIXED
app.get('/api/workflows', async (req, res) => {
  try {
    // Remove unsupported pagination parameters
    const { active } = req.query;
    const params = {};
    
    if (active === 'true') params.active = true;
    if (active === 'false') params.active = false;
    
    const data = await n8nApiRequest('GET', 'workflows', null, params);
    res.json(data);
  } catch (error) {
    console.error('Error fetching workflows:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get workflow by ID - UPDATED
app.get('/api/workflows/:id', async (req, res) => {
  try {
    const data = await n8nApiRequest('GET', `workflows/${req.params.id}`);
    res.json(data);
  } catch (error) {
    console.error(`Error fetching workflow ${req.params.id}:`, error.message);
    
    // Provide better error response
    if (error.message.includes('not found')) {
      res.status(404).json({ error: `Workflow with ID ${req.params.id} not found` });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get workflow executions - FIXED
app.get('/api/executions/:workflowId', async (req, res) => {
  try {
    // Remove potentially unsupported parameters
    const params = {
      workflowId: req.params.workflowId
    };
    
    const data = await n8nApiRequest('GET', 'executions', null, params);
    
    res.json(data);
  } catch (error) {
    console.error(`Error fetching executions for workflow ${req.params.workflowId}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// Toggle workflow active state - UPDATED
app.post('/api/workflows/:id/toggle', async (req, res) => {
  try {
    // First get current workflow state
    const workflow = await n8nApiRequest('GET', `workflows/${req.params.id}`);
    
    // Prepare update with only required fields to prevent overwrite issues
    const updateData = {
      active: !workflow.active
    };
    
    // Update the workflow
    const updatedWorkflow = await n8nApiRequest(
      'PATCH', // Using PATCH instead of PUT to only update specific fields
      `workflows/${req.params.id}/activate`,
      { active: !workflow.active }
    );
    
    res.json(updatedWorkflow);
  } catch (error) {
    console.error(`Error toggling workflow ${req.params.id}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// Email Analytics Routes
app.get('/api/emails', async (req, res) => {
  try {
    // Get emails
    const emails = await db('emails')
      .orderBy('receivedAt', 'desc')
      .limit(50);
      
    // For each email, get its actions
    for (const email of emails) {
      const actions = await db('actions')
        .where('emailId', email.id)
        .select('*');
        
      email.actions = actions;
    }
    
    res.json(emails);
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    // Get email count
    const [emailsResult] = await db('emails').count('* as count');
    const emailsProcessed = emailsResult.count;
    
    // Get calendar events count
    const [calendarResult] = await db('actions')
      .where('type', 'calendar_event')
      .count('* as count');
    const calendarEvents = calendarResult.count;
    
    // Get tasks count
    const [tasksResult] = await db('actions')
      .where('type', 'task_created')
      .count('* as count');
    const tasksCreated = tasksResult.count;
    
    // Get errors count
    const [errorsResult] = await db('actions')
      .where('success', false)
      .count('* as count');
    const errors = errorsResult.count;
    
    const successRate = emailsProcessed > 0 ? 
      Math.round(((emailsProcessed - errors) / emailsProcessed) * 100) : 0;

    res.json({
      emailsProcessed,
      calendarEvents,
      tasksCreated,
      errors,
      successRate
    });
  } catch (error) {
    console.error('Error generating stats:', error);
    res.status(500).json({ error: 'Failed to generate stats' });
  }
});

// Webhook endpoint for n8n to push email processing results
app.post('/api/webhook/email-processed', async (req, res) => {
  try {
    // Get data from either body or query parameters
    const emailData = Object.keys(req.body).length > 0 ? req.body : req.query;
    
    // Safely extract date from emailData
    let receivedDate;
    try {
      if (emailData.parsedEmail && emailData.parsedEmail.date) {
        receivedDate = new Date(emailData.parsedEmail.date);
        
        // Validate that the date is valid
        if (isNaN(receivedDate.getTime())) {
          // Fall back to current date if invalid
          receivedDate = new Date();
        }
      } else {
        receivedDate = new Date();
      }
    } catch (dateError) {
      console.warn('Date parsing error:', dateError);
      receivedDate = new Date();
    }
    
    // Make sure we can extract parsedEmail properties safely
    const parsedEmail = emailData.parsedEmail || {};
    const from = parsedEmail.from || 'Unknown';
    const subject = parsedEmail.subject || 'No Subject';
    
    // Insert email with safe date handling
    const [emailId] = await db('emails').insert({
      emailId: emailData.id || `temp-${Date.now()}`,
      threadId: emailData.threadId || null,
      from: from,
      subject: subject,
      receivedAt: receivedDate.toISOString(),
      processedAt: new Date().toISOString(),
      category: emailData.category || 'uncategorized',
      priority: emailData.priority || 'normal',
      followUpNeeded: emailData.followUpNeeded || false,
      followUpDate: null, // Safely set to null initially
      workflowId: emailData.workflowId || null
    });
    
    // Process and add follow-up date if it exists
    if (emailData.followUpDate) {
      try {
        const followUpDate = new Date(emailData.followUpDate);
        if (!isNaN(followUpDate.getTime())) {
          await db('emails')
            .where('id', emailId)
            .update({ followUpDate: followUpDate.toISOString() });
        }
      } catch (followUpError) {
        console.warn('Follow-up date parsing error:', followUpError);
      }
    }
    
    // Insert actions with better error handling
    if (emailData.actions) {
      try {
        let actionsList = [];
        
        // Handle different formats of actions data
        if (typeof emailData.actions === 'string') {
          // Try to parse as JSON if it's a string
          try {
            actionsList = JSON.parse(emailData.actions);
          } catch {
            // If not JSON, create a single text action
            actionsList = [{
              type: 'text',
              details: emailData.actions,
              success: true
            }];
          }
        } else if (Array.isArray(emailData.actions)) {
          actionsList = emailData.actions;
        } else if (typeof emailData.actions === 'object') {
          actionsList = [emailData.actions];
        }
        
        // Process each action
        if (actionsList.length > 0) {
          const actionInserts = actionsList.map(action => ({
            emailId: emailId,
            type: action.type || 'unknown',
            details: typeof action.details === 'object' ? 
              JSON.stringify(action.details) : 
              String(action.details || ''),
            success: !!action.success
          }));
          
          await db('actions').insert(actionInserts);
        }
      } catch (actionsError) {
        console.error('Error processing actions:', actionsError);
      }
    }
    
    res.status(201).json({ success: true, id: emailId });
  } catch (error) {
    console.error('Error saving processed email:', error);
    res.status(500).json({ error: 'Failed to save email data: ' + error.message });
  }
});

// Workflow statistics by ID - UPDATED
app.get('/api/workflows/:id/stats', async (req, res) => {
  try {
    // First get workflow data from n8n
    const workflow = await n8nApiRequest('GET', `workflows/${req.params.id}`);
    
    // Then get execution stats from SQLite
    const [emailsResult] = await db('emails')
      .where('workflowId', req.params.id)
      .count('* as count');
    const emailsProcessed = emailsResult.count;
    
    // Get calendar events
    const [calendarResult] = await db('actions')
      .join('emails', 'actions.emailId', 'emails.id')
      .where('emails.workflowId', req.params.id)
      .where('actions.type', 'calendar_event')
      .count('* as count');
    const calendarEvents = calendarResult.count;
    
    // Get tasks
    const [tasksResult] = await db('actions')
      .join('emails', 'actions.emailId', 'emails.id')
      .where('emails.workflowId', req.params.id)
      .where('actions.type', 'task_created')
      .count('* as count');
    const tasksCreated = tasksResult.count;
    
    // Get errors
    const [errorsResult] = await db('actions')
      .join('emails', 'actions.emailId', 'emails.id')
      .where('emails.workflowId', req.params.id)
      .where('actions.success', false)
      .count('* as count');
    const errors = errorsResult.count;
    
    const successRate = emailsProcessed > 0 ? 
      Math.round(((emailsProcessed - errors) / emailsProcessed) * 100) : 0;
    
    res.json({
      ...workflow,
      stats: {
        emailsProcessed,
        calendarEvents,
        tasksCreated,
        errors,
        successRate
      }
    });
  } catch (error) {
    console.error(`Error fetching workflow stats for ${req.params.id}:`, error.message);
    
    // Handle workflow not found specifically
    if (error.message.includes('not found')) {
      res.status(404).json({ error: `Workflow with ID ${req.params.id} not found` });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Debug endpoint to display connection info - FIXED
app.get('/api/test-connections', async (req, res) => {
  const results = {
    backend: 'ok',
    database: false,
    n8n: false,
    n8nApiUrl: N8N_API_URL,
    n8nHasApiKey: !!N8N_API_KEY,
    n8nWorkflows: []
  };
  
  // Test database connection
  try {
    const [dbTest] = await db('sqlite_master').count('* as count');
    results.database = dbTest && dbTest.count >= 0;
  } catch (dbError) {
    console.error('Database test failed:', dbError);
    results.databaseError = dbError.message;
  }
  
  // Test n8n connection
  try {
    // Remove potentially unsupported parameters
    const workflowsData = await n8nApiRequest('GET', 'workflows');
    
    results.n8n = true;
    // Handle difference in API response format
    const workflows = Array.isArray(workflowsData) ? 
      workflowsData : 
      (workflowsData?.data || []);
      
    results.n8nWorkflows = workflows.map(wf => ({
      id: wf.id,
      name: wf.name,
      active: wf.active
    }));
  } catch (n8nError) {
    console.error('n8n test failed:', n8nError.message);
    results.n8nError = n8nError.message;
  }
  
  res.json(results);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
