export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5678/api';
export const AUTH_TOKEN_KEY = 'n8n_auth_token';
export const WORKFLOW_STATUS = {
    PENDING: 'pending',
    RUNNING: 'running',
    SUCCESS: 'success',
    FAILED: 'failed',
};
export const DEFAULT_PAGE_SIZE = 10;