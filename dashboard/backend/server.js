const express = require('express');
const cors = require('cors');
const axios = require('axios');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
