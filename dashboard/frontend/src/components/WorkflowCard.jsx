import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Switch,
  Chip,
  CardActions,
  Button,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../context/WorkflowContext';

const WorkflowCard = ({ workflow }) => {
  const navigate = useNavigate();
  const { toggleWorkflowState, loading } = useWorkflow();
  
  const handleToggle = (event) => {
    event.stopPropagation();
    toggleWorkflowState(workflow.id);
  };
  
  return (
    <Card 
      className="card" 
      sx={{ 
        minWidth: 275, 
        mb: 2, 
        cursor: 'pointer',
        bgcolor: workflow.active ? 'rgba(76, 175, 80, 0.08)' : 'inherit' 
      }}
      onClick={() => navigate(`/workflow/${workflow.id}`)}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="div">
            {workflow.name}
          </Typography>
          {loading === workflow.id ? (
            <CircularProgress size={24} />
          ) : (
            <Switch
              checked={workflow.active}
              onChange={handleToggle}
              color="primary"
            />
          )}
        </Box>
        
        <Box mt={2} display="flex" gap={1}>
          <Chip 
            label={workflow.active ? "Active" : "Inactive"} 
            color={workflow.active ? "success" : "default"} 
            size="small" 
          />
          {workflow.tags && workflow.tags.map(tag => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Box>
        
        <Typography sx={{ mb: 1.5, mt: 1.5 }} color="text.secondary">
          Last updated: {new Date(workflow.updatedAt).toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">View Details</Button>
        <Button size="small">Execution History</Button>
      </CardActions>
    </Card>
  );
};

export default WorkflowCard;
