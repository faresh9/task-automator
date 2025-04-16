import axios from 'axios';

const API_BASE_URL = process.env.N8N_API_BASE_URL;

const n8nApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to get all workflows
export const getWorkflows = async () => {
    const response = await n8nApi.get('/workflows');
    return response.data;
};

// Function to get a specific workflow by ID
export const getWorkflowById = async (id) => {
    const response = await n8nApi.get(`/workflows/${id}`);
    return response.data;
};

// Function to create a new workflow
export const createWorkflow = async (workflowData) => {
    const response = await n8nApi.post('/workflows', workflowData);
    return response.data;
};

// Function to update an existing workflow
export const updateWorkflow = async (id, workflowData) => {
    const response = await n8nApi.put(`/workflows/${id}`, workflowData);
    return response.data;
};

// Function to delete a workflow
export const deleteWorkflow = async (id) => {
    const response = await n8nApi.delete(`/workflows/${id}`);
    return response.data;
};