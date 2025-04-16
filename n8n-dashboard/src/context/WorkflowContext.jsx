import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWorkflows } from '../api/n8nApi';

const WorkflowContext = createContext();

export const WorkflowProvider = ({ children }) => {
    const [workflows, setWorkflows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadWorkflows = async () => {
            try {
                const data = await fetchWorkflows();
                setWorkflows(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadWorkflows();
    }, []);

    return (
        <WorkflowContext.Provider value={{ workflows, loading, error }}>
            {children}
        </WorkflowContext.Provider>
    );
};

export const useWorkflows = () => {
    return useContext(WorkflowContext);
};