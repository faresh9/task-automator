import React, { useEffect, useState } from 'react';
import { getWorkflowStats } from '../../api/n8nApi';
import './WorkflowStats.css';

const WorkflowStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getWorkflowStats();
                setStats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="workflow-stats">
            <h2>Workflow Statistics</h2>
            <div className="stats">
                <div className="stat">
                    <h3>Total Executions</h3>
                    <p>{stats.totalExecutions}</p>
                </div>
                <div className="stat">
                    <h3>Successful Executions</h3>
                    <p>{stats.successfulExecutions}</p>
                </div>
                <div className="stat">
                    <h3>Failed Executions</h3>
                    <p>{stats.failedExecutions}</p>
                </div>
                <div className="stat">
                    <h3>Average Execution Time</h3>
                    <p>{stats.averageExecutionTime} ms</p>
                </div>
            </div>
        </div>
    );
};

export default WorkflowStats;