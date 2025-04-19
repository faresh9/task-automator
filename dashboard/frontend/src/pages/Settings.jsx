import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const Settings = () => {
  const [settings, setSettings] = useState({
    n8nUrl: 'http://localhost:5678',
    n8nApiKey: '',
    autoRefresh: true,
    refreshInterval: 30,
    notificationsEnabled: true,
    emailDigest: true
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSave = () => {
    // Here you would save to localStorage or backend
    localStorage.setItem('dashboard-settings', JSON.stringify(settings));
    
    setSnackbar({
      open: true,
      message: 'Settings saved successfully',
      severity: 'success'
    });
  };
  
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure your dashboard preferences
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                API Configuration
              </Typography>
              
              <Box component="form" sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="n8n URL"
                  name="n8nUrl"
                  variant="outlined"
                  margin="normal"
                  value={settings.n8nUrl}
                  onChange={handleChange}
                  helperText="The URL where your n8n instance is running"
                />
                
                <TextField
                  fullWidth
                  label="n8n API Key"
                  name="n8nApiKey"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  value={settings.n8nApiKey}
                  onChange={handleChange}
                  helperText="API key for accessing n8n"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Dashboard Options
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoRefresh}
                      onChange={handleChange}
                      name="autoRefresh"
                    />
                  }
                  label="Auto-refresh data"
                />
                
                {settings.autoRefresh && (
                  <TextField
                    fullWidth
                    label="Refresh Interval (seconds)"
                    name="refreshInterval"
                    type="number"
                    variant="outlined"
                    margin="normal"
                    value={settings.refreshInterval}
                    onChange={handleChange}
                    inputProps={{ min: 10, max: 300 }}
                  />
                )}
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notificationsEnabled}
                      onChange={handleChange}
                      name="notificationsEnabled"
                    />
                  }
                  label="Enable notifications"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailDigest}
                      onChange={handleChange}
                      name="emailDigest"
                    />
                  }
                  label="Send daily email digest"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save Settings
        </Button>
      </Box>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings;
