import React, { useEffect, useState } from 'react';
import { getExecutionHistory } from '../../api/n8nApi';
import Loading from '../common/Loading';

const ExecutionHistory = () => {
    const [executions, setExecutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExecutionHistory = async () => {
            try {
                const data = await getExecutionHistory();
                setExecutions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExecutionHistory();
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="execution-history">
            <h2>Execution History</h2>
            <table>
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Status</th>
                        <th>Workflow Name</th>
                    </tr>
                </thead>
                <tbody>
                    {executions.map((execution) => (
                        <tr key={execution.id}>
                            <td>{new Date(execution.timestamp).toLocaleString()}</td>
                            <td>{execution.status}</td>
                            <td>{execution.workflowName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExecutionHistory;