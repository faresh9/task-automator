import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button, 
  Switch, 
  FormControlLabel,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Alert
} from '@mui/material';
import { useWorkflow } from '../context/WorkflowContext';
import ExecutionTable from '../components/ExecutionTable';

const WorkflowDetails = () => {
  const { id } = useParams();
  const [tabValue, setTabValue] = React.useState(0);
  const { 
    fetchWorkflowById, 
    currentWorkflow, 
    loading, 
    toggleWorkflowState, 
    executions, 
    fetchExecutions 
  } = useWorkflow();
  
  useEffect(() => {
    if (id) {
      fetchWorkflowById(id);
      fetchExecutions(id);
    }
  }, [id, fetchWorkflowById]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  if (loading === 'workflow') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!currentWorkflow) {
    return (
      <Container>
        <Typography variant="h5" gutterBottom>Workflow not found</Typography>
        <Alert severity="error">
          Could not find workflow with ID: {id}. Make sure n8n is running and the workflow exists.
        </Alert>
        <Box mt={2}>
          <Button variant="contained" onClick={() => fetchWorkflowById(id)}>
            Retry
          </Button>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {currentWorkflow.name}
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <FormControlLabel
            control={
              <Switch
                checked={currentWorkflow.active}
                onChange={() => toggleWorkflowState(id)}
                disabled={loading === id}
              />
            }
            label={currentWorkflow.active ? 'Active' : 'Inactive'}
          />
          {loading === id && <CircularProgress size={24} />}
        </Box>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="Executions" />
          <Tab label="Configuration" />
        </Tabs>
        <Divider sx={{ mb: 2 }} />
        
        {/* Tab panels */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Workflow Details
                  </Typography>
                  <Typography variant="body2" component="div">
                    <strong>ID:</strong> {currentWorkflow.id}
                  </Typography>
                  <Typography variant="body2" component="div">
                    <strong>Created:</strong> {new Date(currentWorkflow.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" component="div">
                    <strong>Last Updated:</strong> {new Date(currentWorkflow.updatedAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" component="div">
                    <strong>Nodes:</strong> {currentWorkflow.nodes?.length || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Stats
                  </Typography>
                  <Typography variant="body2" component="div">
                    <strong>Emails Processed:</strong> {currentWorkflow.stats?.emailsProcessed || 0}
                  </Typography>
                  <Typography variant="body2" component="div">
                    <strong>Calendar Events:</strong> {currentWorkflow.stats?.calendarEvents || 0}
                  </Typography>
                  <Typography variant="body2" component="div">
                    <strong>Tasks Created:</strong> {currentWorkflow.stats?.tasksCreated || 0}
                  </Typography>
                  <Typography variant="body2" component="div">
                    <strong>Success Rate:</strong> {currentWorkflow.stats?.successRate || 0}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        
        {tabValue === 1 && (
          <Box>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button variant="contained">Refresh</Button>
            </Box>
            <ExecutionTable executions={executions} />
          </Box>
        )}
        
        {tabValue === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Configuration
              </Typography>
              <pre style={{ overflow: 'auto', maxHeight: '400px' }}>
                {JSON.stringify(currentWorkflow, null, 2)}
              </pre>
              <Box mt={2} display="flex" gap={2}>
                <Button variant="contained" color="primary">
                  Export Config
                </Button>
                <Button variant="outlined">
                  Edit Configuration
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default WorkflowDetails;
