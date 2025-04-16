import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkflowDetails } from '../../api/n8nApi';
import Loading from '../common/Loading';
import ExecutionList from './ExecutionList';
import NodeVisualizer from './NodeVisualizer';

const WorkflowDetails = () => {
    const { workflowId } = useParams();
    const [workflow, setWorkflow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWorkflowDetails = async () => {
            try {
                const data = await getWorkflowDetails(workflowId);
                setWorkflow(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkflowDetails();
    }, [workflowId]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>{workflow.name}</h1>
            <p>{workflow.description}</p>
            <NodeVisualizer nodes={workflow.nodes} />
            <ExecutionList workflowId={workflowId} />
        </div>
    );
};

export default WorkflowDetails;