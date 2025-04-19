const Config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  AUTO_REFRESH: true,
  REFRESH_INTERVAL: 30000, // 30 seconds
  
  // Load settings from localStorage if available
  loadSettings() {
    try {
      const savedSettings = localStorage.getItem('dashboard-settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        this.AUTO_REFRESH = parsedSettings.autoRefresh ?? this.AUTO_REFRESH;
        this.REFRESH_INTERVAL = (parsedSettings.refreshInterval ?? 30) * 1000;
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }
};

export default Config;