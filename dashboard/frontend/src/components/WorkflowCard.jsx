import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Chip,
  Button
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const WorkflowCard = ({ workflow }) => {
  // Make sure workflow.id exists and is not undefined
  const workflowId = workflow?.id || 'unknown';
  
  return (
    <Card sx={{ mb: 2, position: 'relative' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {workflow.name}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Chip 
            label={workflow.active ? 'Active' : 'Inactive'} 
            color={workflow.active ? 'success' : 'default'} 
            size="small"
            icon={workflow.active ? <PlayArrowIcon /> : <PauseIcon />} 
          />
          
          {/* Use correct path format with numeric ID */}
          <Button 
            component={RouterLink} 
            to={`/workflow/${workflowId}`} 
            variant="outlined" 
            size="small"
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WorkflowCard;
