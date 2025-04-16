import { useEffect, useState } from 'react';
import { getWorkflowStatus } from '../api/n8nApi';

const useWorkflowStatus = (workflowId) => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                setLoading(true);
                const response = await getWorkflowStatus(workflowId);
                setStatus(response.status);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();

        const intervalId = setInterval(fetchStatus, 5000); // Fetch status every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [workflowId]);

    return { status, loading, error };
};

export default useWorkflowStatus;