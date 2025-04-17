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
  FormControlLabel,
  Switch,
  Divider,
  Alert
} from '@mui/material';

const Settings = () => {
  const [settings, setSettings] = useState({
    n8nApiUrl: 'http://localhost:5678',
    n8nApiKey: '',
    emailNotifications: true,
    notificationEmail: '',
    dashboardRefreshRate: 30,
  });
  
  const [saved, setSaved] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };
  
  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setSettings({
      ...settings,
      [name]: checked
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Save settings to local storage or API
    localStorage.setItem('dashboardSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };
  
  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure your dashboard and notification preferences
        </Typography>
      </Box>
      
      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              n8n Connection
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="n8n API URL"
                  name="n8nApiUrl"
                  value={settings.n8nApiUrl}
                  onChange={handleChange}
                  helperText="The URL of your n8n instance, e.g., http://localhost:5678"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="n8n API Key"
                  name="n8nApiKey"
                  value={settings.n8nApiKey}
                  onChange={handleChange}
                  type="password"
                  helperText="Your n8n API key for authentication"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={handleSwitchChange}
                      name="emailNotifications"
                    />
                  }
                  label="Email Notifications"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notification Email"
                  name="notificationEmail"
                  value={settings.notificationEmail}
                  onChange={handleChange}
                  disabled={!settings.emailNotifications}
                  helperText="Email address to receive notifications"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Dashboard Preferences
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Dashboard Refresh Rate (seconds)"
                  name="dashboardRefreshRate"
                  type="number"
                  value={settings.dashboardRefreshRate}
                  onChange={handleChange}
                  inputProps={{ min: 10, max: 300 }}
                  helperText="How often to refresh the dashboard data (10-300 seconds)"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" type="submit">
            Save Settings
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default Settings;
