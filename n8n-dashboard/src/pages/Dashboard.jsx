import React, { useEffect, useState } from 'react';
import WorkflowCard from '../components/dashboard/WorkflowCard';
import WorkflowStats from '../components/dashboard/WorkflowStats';
import ExecutionHistory from '../components/dashboard/ExecutionHistory';
import { useN8nApi } from '../hooks/useN8nApi';

const Dashboard = () => {
    const { fetchWorkflows, fetchWorkflowStats, fetchExecutionHistory } = useN8nApi();
    const [workflows, setWorkflows] = useState([]);
    const [stats, setStats] = useState({});
    const [executionHistory, setExecutionHistory] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const workflowsData = await fetchWorkflows();
            const statsData = await fetchWorkflowStats();
            const executionHistoryData = await fetchExecutionHistory();

            setWorkflows(workflowsData);
            setStats(statsData);
            setExecutionHistory(executionHistoryData);
        };

        loadData();
    }, [fetchWorkflows, fetchWorkflowStats, fetchExecutionHistory]);

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <WorkflowStats stats={stats} />
            <div className="workflow-cards">
                {workflows.map(workflow => (
                    <WorkflowCard key={workflow.id} workflow={workflow} />
                ))}
            </div>
            <ExecutionHistory history={executionHistory} />
        </div>
    );
};

export default Dashboard;