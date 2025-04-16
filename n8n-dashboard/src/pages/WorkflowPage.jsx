import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { WorkflowContext } from '../context/WorkflowContext';
import WorkflowDetails from '../components/workflow/WorkflowDetails';
import ExecutionList from '../components/workflow/ExecutionList';
import Loading from '../components/common/Loading';

const WorkflowPage = () => {
    const { workflowId } = useParams();
    const { fetchWorkflow, workflow, loading } = useContext(WorkflowContext);

    useEffect(() => {
        fetchWorkflow(workflowId);
    }, [fetchWorkflow, workflowId]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="workflow-page">
            <h1>{workflow.name}</h1>
            <WorkflowDetails workflow={workflow} />
            <ExecutionList workflowId={workflowId} />
        </div>
    );
};

export default WorkflowPage;