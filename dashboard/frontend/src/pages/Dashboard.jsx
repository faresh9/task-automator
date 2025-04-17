import React, { useEffect } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TaskIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useWorkflow } from '../context/WorkflowContext';
import WorkflowCard from '../components/WorkflowCard';
import StatsCard from '../components/StatsCard';
import ExecutionTable from '../components/ExecutionTable';

const Dashboard = () => {
  const { workflows, fetchWorkflows, stats, executions, fetchExecutions } = useWorkflow();
  
  useEffect(() => {
    fetchWorkflows();
    
    // If we have workflow IDs, fetch executions for the first one
    if (workflows && workflows.length > 0) {
      fetchExecutions(workflows[0].id);
    }
  }, [fetchWorkflows, workflows?.length]);
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Email Automation Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and manage your n8n email automation workflow
        </Typography>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title="Emails Processed" 
            value={stats?.emailsProcessed || 0} 
            icon={<EmailIcon fontSize="large" />} 
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title="Calendar Events" 
            value={stats?.calendarEvents || 0} 
            icon={<CalendarMonthIcon fontSize="large" />} 
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title="Tasks Created" 
            value={stats?.tasksCreated || 0} 
            icon={<TaskIcon fontSize="large" />} 
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title="Errors" 
            value={stats?.errors || 0} 
            icon={<ErrorIcon fontSize="large" />} 
            color="error"
          />
        </Grid>
      </Grid>
      
      {/* Workflows */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Workflows
        </Typography>
        {workflows && workflows.map(workflow => (
          <WorkflowCard key={workflow.id} workflow={workflow} />
        ))}
      </Box>
      
      {/* Recent Executions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recent Executions
        </Typography>
        <ExecutionTable executions={executions} />
      </Box>
    </Container>
  );
};

export default Dashboard;
