import React, { useEffect, useState } from 'react';
import { getWorkflowExecutions } from '../../api/n8nApi';
import Loading from '../common/Loading';

const ExecutionList = ({ workflowId }) => {
    const [executions, setExecutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExecutions = async () => {
            try {
                const data = await getWorkflowExecutions(workflowId);
                setExecutions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExecutions();
    }, [workflowId]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="execution-list">
            <h2>Execution History</h2>
            <ul>
                {executions.map((execution) => (
                    <li key={execution.id}>
                        <div>
                            <strong>Started:</strong> {new Date(execution.startTime).toLocaleString()}
                        </div>
                        <div>
                            <strong>Duration:</strong> {execution.duration} ms
                        </div>
                        <div>
                            <strong>Status:</strong> {execution.status}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExecutionList;