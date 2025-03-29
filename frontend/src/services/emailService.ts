import api from './api';

export interface Email {
  id: string;
  subject: string;
  sender: string;
  body: string;
  date: string;
}

export interface EmailSendRequest {
  to: string;
  subject: string;
  body: string;
}

export interface EmailProcessRequest {
  email_text: string;
}

const emailService = {
  getUnreadEmails: async (): Promise<Email[]> => {
    const response = await api.get('/api/emails/unread');
    return response.data.emails || [];
  },
  
  sendEmail: async (email: EmailSendRequest): Promise<any> => {
    const response = await api.post('/api/emails/send', email);
    return response.data;
  },
  
  processEmail: async (request: EmailProcessRequest): Promise<any> => {
    const response = await api.post('/api/smart/email-process', request);
    return response.data;
  },
  
  categorizeEmail: async (request: EmailProcessRequest): Promise<any> => {
    const response = await api.post('/api/categorize-email', request);
    return response.data;
  },
};

export default emailService;