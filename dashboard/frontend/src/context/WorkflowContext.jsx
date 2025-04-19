import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useWorkflowAPI } from '../hooks/useWorkflowAPI';

const WorkflowContext = createContext();

export const WorkflowProvider = ({ children }) => {
  const { 
    loading, 
    error, 
    fetchWorkflows: apiFetchWorkflows, 
    fetchWorkflowById: apiFetchWorkflowById,
    fetchExecutions: apiFetchExecutions,
    fetchStats: apiFetchStats,
    fetchEmails: apiFetchEmails,
    toggleWorkflowState: apiToggleWorkflowState
  } = useWorkflowAPI();
  
  const [workflows, setWorkflows] = useState([]);
  const [currentWorkflow, setCurrentWorkflow] = useState(null);
  const [executions, setExecutions] = useState([]);
  const [stats, setStats] = useState({
    emailsProcessed: 0,
    calendarEvents: 0,
    tasksCreated: 0,
    errors: 0,
    successRate: 0
  });
  const [emails, setEmails] = useState([]);
  
  // Fetch stats on initial load
  useEffect(() => {
    fetchStats();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  const fetchWorkflows = useCallback(async () => {
    const data = await apiFetchWorkflows();
    if (data && Array.isArray(data)) {
      setWorkflows(data);
    }
  }, [apiFetchWorkflows]);
  
  const fetchWorkflowById = useCallback(async (id) => {
    const data = await apiFetchWorkflowById(id);
    if (data) {
      setCurrentWorkflow(data);
    }
  }, [apiFetchWorkflowById]);
  
  const fetchExecutions = useCallback(async (workflowId) => {
    const data = await apiFetchExecutions(workflowId);
    if (data && Array.isArray(data)) {
      setExecutions(data);
    }
  }, [apiFetchExecutions]);
  
  const fetchStats = useCallback(async () => {
    const data = await apiFetchStats();
    if (data) {
      setStats(data);
    }
  }, [apiFetchStats]);
  
  const fetchEmails = useCallback(async () => {
    const data = await apiFetchEmails();
    if (data && Array.isArray(data)) {
      setEmails(data);
    }
  }, [apiFetchEmails]);
  
  const toggleWorkflowState = useCallback(async (workflowId) => {
    const data = await apiToggleWorkflowState(workflowId);
    if (data) {
      // Update both workflows list and current workflow if it's the same one
      setWorkflows(prev => 
        prev.map(wf => wf.id === workflowId ? { ...wf, active: !wf.active } : wf)
      );
      
      if (currentWorkflow && currentWorkflow.id === workflowId) {
        setCurrentWorkflow(prev => ({ ...prev, active: !prev.active }));
      }
    }
  }, [apiToggleWorkflowState, currentWorkflow]);
  
  const value = {
    workflows,
    currentWorkflow,
    loading,
    error,
    stats,
    executions,
    emails,
    fetchWorkflows,
    fetchWorkflowById,
    fetchExecutions,
    fetchStats,
    fetchEmails,
    toggleWorkflowState,
  };
  
  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};
