import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const useWorkflowAPI = () => {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  
  const fetchWorkflows = useCallback(async () => {
    setLoading('workflows');
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/workflows`);
      setLoading(null);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch workflows');
      setLoading(null);
      return [];
    }
  }, []);
  
  const fetchWorkflowById = useCallback(async (id) => {
    if (!id) return null;
    
    setLoading('workflow');
    setError(null);
    
    try {
      // Use the new endpoint that includes stats
      const response = await axios.get(`${API_URL}/workflows/${id}/stats`);
      setLoading(null);
      return response.data;
    } catch (err) {
      setError(err.message || `Failed to fetch workflow ${id}`);
      setLoading(null);
      return null;
    }
  }, []);
  
  const fetchExecutions = useCallback(async (workflowId) => {
    if (!workflowId) return [];
    
    setLoading('executions');
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/executions/${workflowId}`);
      setLoading(null);
      return response.data;
    } catch (err) {
      setError(err.message || `Failed to fetch executions for workflow ${workflowId}`);
      setLoading(null);
      return [];
    }
  }, []);
  
  const fetchStats = useCallback(async () => {
    setLoading('stats');
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/stats`);
      setLoading(null);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch statistics');
      setLoading(null);
      return null;
    }
  }, []);
  
  const fetchEmails = useCallback(async () => {
    setLoading('emails');
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/emails`);
      setLoading(null);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch emails');
      setLoading(null);
      return [];
    }
  }, []);
  
  const toggleWorkflowState = useCallback(async (workflowId) => {
    if (!workflowId) return null;
    
    setLoading(workflowId);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/workflows/${workflowId}/toggle`);
      setLoading(null);
      return response.data;
    } catch (err) {
      setError(err.message || `Failed to toggle workflow state for ${workflowId}`);
      setLoading(null);
      return null;
    }
  }, []);
  
  return {
    loading,
    error,
    fetchWorkflows,
    fetchWorkflowById,
    fetchExecutions,
    fetchStats,
    fetchEmails,
    toggleWorkflowState,
  };
};
