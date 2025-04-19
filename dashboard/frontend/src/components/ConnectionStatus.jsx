import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, CircularProgress, Chip } from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ConnectionStatus = () => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [n8nStatus, setN8nStatus] = useState('checking');

  useEffect(() => {
    // Check backend connection
    axios.get(`${API_URL}/stats`)
      .then(() => setBackendStatus('connected'))
      .catch(() => setBackendStatus('disconnected'));
    
    // Check n8n connection through backend
    axios.get(`${API_URL}/workflows`)
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          setN8nStatus('connected');
        } else {
          setN8nStatus('error');
        }
      })
      .catch(() => setN8nStatus('disconnected'));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'success';
      case 'checking': return 'warning';
      case 'disconnected': 
      case 'error':
        return 'error';
      default: return 'default';
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>Connection Status</Typography>
      <Box display="flex" gap={2}>
        <Chip 
          label={`Backend: ${backendStatus}`}
          color={getStatusColor(backendStatus)}
          icon={backendStatus === 'checking' ? <CircularProgress size={16} /> : null}
        />
        <Chip 
          label={`n8n: ${n8nStatus}`}
          color={getStatusColor(n8nStatus)}
          icon={n8nStatus === 'checking' ? <CircularProgress size={16} /> : null}
        />
      </Box>
    </Paper>
  );
};

export default ConnectionStatus;