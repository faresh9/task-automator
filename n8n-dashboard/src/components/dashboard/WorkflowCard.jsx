import React from 'react';

const WorkflowCard = ({ workflow, onEdit, onDelete }) => {
    return (
        <div className="workflow-card">
            <h3>{workflow.name}</h3>
            <p>Status: {workflow.active ? 'Active' : 'Inactive'}</p>
            <p>Last Executed: {workflow.lastExecuted ? new Date(workflow.lastExecuted).toLocaleString() : 'Never'}</p>
            <div className="workflow-card-actions">
                <button onClick={() => onEdit(workflow.id)}>Edit</button>
                <button onClick={() => onDelete(workflow.id)}>Delete</button>
            </div>
        </div>
    );
};

export default WorkflowCard;