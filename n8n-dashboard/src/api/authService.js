import axios from 'axios';

const API_URL = process.env.N8N_API_URL || 'http://localhost:5678/api/v1';

const authService = {
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password,
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    logout: async () => {
        try {
            await axios.post(`${API_URL}/auth/logout`);
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Logout failed');
        }
    },

    getToken: () => {
        return localStorage.getItem('n8n_token');
    },

    setToken: (token) => {
        localStorage.setItem('n8n_token', token);
    },

    clearToken: () => {
        localStorage.removeItem('n8n_token');
    },
};

export default authService;