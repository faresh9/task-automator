import { useState, useEffect } from 'react';
import { fetchWorkflows, fetchWorkflowById } from '../api/n8nApi';

const useN8nApi = () => {
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

    const getWorkflow = async (id) => {
        setLoading(true);
        try {
            const workflow = await fetchWorkflowById(id);
            return workflow;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { workflows, loading, error, getWorkflow };
};

export default useN8nApi;