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

// n8n API Configuration
const N8N_API_URL = process.env.N8N_API_URL || 'http://localhost:5678';
const N8N_API_KEY = process.env.N8N_API_KEY;

// Routes for n8n workflow data
app.get('/api/workflows', async (req, res) => {
  try {
    const response = await axios.get(`${N8N_API_URL}/api/v1/workflows`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching workflows:', error);
    res.status(500).json({ error: 'Failed to fetch workflows' });
  }
});

// Get workflow by ID
app.get('/api/workflows/:id', async (req, res) => {
  try {
    const response = await axios.get(`${N8N_API_URL}/api/v1/workflows/${req.params.id}`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching workflow ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch workflow details' });
  }
});

// Get workflow executions
app.get('/api/executions/:workflowId', async (req, res) => {
  try {
    const response = await axios.get(
      `${N8N_API_URL}/api/v1/executions?workflowId=${req.params.workflowId}`,
      {
        headers: {
          'X-N8N-API-KEY': N8N_API_KEY
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching executions for workflow ${req.params.workflowId}:`, error);
    res.status(500).json({ error: 'Failed to fetch execution data' });
  }
});

// Toggle workflow active state
app.post('/api/workflows/:id/toggle', async (req, res) => {
  try {
    // First get current workflow state
    const workflowResponse = await axios.get(`${N8N_API_URL}/api/v1/workflows/${req.params.id}`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY
      }
    });
    
    const workflow = workflowResponse.data;
    const updatedWorkflow = {
      ...workflow,
      active: !workflow.active
    };
    
    // Update the workflow
    const updateResponse = await axios.put(
      `${N8N_API_URL}/api/v1/workflows/${req.params.id}`,
      updatedWorkflow,
      {
        headers: {
          'X-N8N-API-KEY': N8N_API_KEY
        }
      }
    );
    
    res.json(updateResponse.data);
  } catch (error) {
    console.error(`Error toggling workflow ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to toggle workflow state' });
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

// Workflow statistics by ID
app.get('/api/workflows/:id/stats', async (req, res) => {
  try {
    // First get workflow data from n8n
    const workflowResponse = await axios.get(`${N8N_API_URL}/api/v1/workflows/${req.params.id}`, {
      headers: { 'X-N8N-API-KEY': N8N_API_KEY }
    });
    
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
      ...workflowResponse.data,
      stats: {
        emailsProcessed,
        calendarEvents,
        tasksCreated,
        errors,
        successRate
      }
    });
  } catch (error) {
    console.error(`Error fetching workflow stats for ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch workflow statistics' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
