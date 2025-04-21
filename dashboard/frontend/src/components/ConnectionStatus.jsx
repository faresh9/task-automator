import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, CircularProgress, Chip, Link, Button } from '@mui/material';
import axios from 'axios';
import RefreshIcon from '@mui/icons-material/Refresh';

const API_URL = 'http://localhost:5000/api';

const ConnectionStatus = () => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [n8nStatus, setN8nStatus] = useState('checking');
  const [detailedStatus, setDetailedStatus] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const checkConnections = async () => {
    setBackendStatus('checking');
    setN8nStatus('checking');
    
    // Check backend connection with detailed diagnostics
    try {
      const response = await axios.get(`${API_URL}/test-connections`);
      setBackendStatus('connected');
      setDetailedStatus(response.data);
      
      if (response.data.n8n) {
        setN8nStatus('connected');
      } else {
        setN8nStatus('disconnected');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setBackendStatus('disconnected');
      setN8nStatus('unknown');
      setDetailedStatus({
        error: error.message,
        hint: 'Make sure your backend server is running on port 5000'
      });
    }
  };

  useEffect(() => {
    checkConnections();
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle1">Connection Status</Typography>
        <Button 
          startIcon={<RefreshIcon />}
          size="small"
          onClick={checkConnections}
          disabled={backendStatus === 'checking' || n8nStatus === 'checking'}
        >
          Refresh
        </Button>
      </Box>
      
      <Box display="flex" gap={2} mb={2}>
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
      
      <Box>
        <Link 
          component="button"
          variant="body2"
          underline="hover"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide details' : 'Show details'}
        </Link>
      </Box>
      
      {showDetails && detailedStatus && (
        <Box mt={2} p={1} bgcolor="#f5f5f5" borderRadius={1}>
          <Typography variant="caption" component="pre" style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(detailedStatus, null, 2)}
          </Typography>
          
          {detailedStatus.n8nError && (
            <Box mt={1}>
              <Typography variant="caption" color="error">
                n8n Connection Error: {detailedStatus.n8nError}
              </Typography>
              <Typography variant="caption" display="block" mt={1}>
                Check:
                <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                  <li>n8n is running at {detailedStatus.n8nApiUrl}</li>
                  <li>API key is correct in .env file</li>
                  <li>n8n API access is enabled</li>
                </ul>
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default ConnectionStatus;