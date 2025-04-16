import React from 'react';
import { useWorkflowContext } from '../../context/WorkflowContext';
import './NodeVisualizer.css';

const NodeVisualizer = () => {
    const { currentWorkflow } = useWorkflowContext();

    if (!currentWorkflow) {
        return <div>No workflow selected</div>;
    }

    const renderNode = (node) => {
        return (
            <div className="node" key={node.id}>
                <h3>{node.name}</h3>
                <p>{node.type}</p>
                {/* Additional node details can be added here */}
            </div>
        );
    };

    return (
        <div className="node-visualizer">
            <h2>Workflow Nodes</h2>
            <div className="nodes-container">
                {currentWorkflow.nodes.map(renderNode)}
            </div>
        </div>
    );
};

export default NodeVisualizer;