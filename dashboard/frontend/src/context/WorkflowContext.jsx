import React, { createContext, useState, useContext, useCallback } from 'react';
import { useWorkflowAPI } from '../hooks/useWorkflowAPI';

const WorkflowContext = createContext();

export const WorkflowProvider = ({ children }) => {
  const { 
    loading, 
    error, 
    fetchWorkflows: apiFetchWorkflows, 
    fetchWorkflowById: apiFetchWorkflowById,
    fetchExecutions: apiFetchExecutions,
    toggleWorkflowState: apiToggleWorkflowState
  } = useWorkflowAPI();
  
  const [workflows, setWorkflows] = useState([]);
  const [currentWorkflow, setCurrentWorkflow] = useState(null);
  const [executions, setExecutions] = useState([]);
  const [stats, setStats] = useState({
    emailsProcessed: 27,
    calendarEvents: 8,
    tasksCreated: 15,
    errors: 2,
    successRate: 92
  });
  
  const fetchWorkflows = useCallback(async () => {
    const data = await apiFetchWorkflows();
    if (data && Array.isArray(data)) {
      setWorkflows(data);
    }
  }, [apiFetchWorkflows]);
  
  const fetchWorkflowById = useCallback(async (id) => {
    const data = await apiFetchWorkflowById(id);
    if (data) {
      // Add some sample stats if not present
      if (!data.stats) {
        data.stats = {
          emailsProcessed: 27,
          calendarEvents: 8,
          tasksCreated: 15,
          errors: 2,
          successRate: 92
        };
      }
      setCurrentWorkflow(data);
    }
  }, [apiFetchWorkflowById]);
  
  const fetchExecutions = useCallback(async (workflowId) => {
    const data = await apiFetchExecutions(workflowId);
    if (data && Array.isArray(data)) {
      setExecutions(data);
    } else {
      // Use sample data if API fails
      setExecutions([
        { 
          id: '1234567890abcdef', 
          startedAt: new Date().toISOString(), 
          stoppedAt: new Date().toISOString(),
          status: 'success',
          node: 'AI Agent' 
        },
        { 
          id: '2345678901abcdef', 
          startedAt: new Date(Date.now() - 3600000).toISOString(), 
          stoppedAt: new Date(Date.now() - 3590000).toISOString(),
          status: 'error',
          node: 'Gmail' 
        }
      ]);
    }
  }, [apiFetchExecutions]);
  
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
    fetchWorkflows,
    fetchWorkflowById,
    fetchExecutions,
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
