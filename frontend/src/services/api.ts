// Base API configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Generic request handler with error handling
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');
  
  // Set default headers
  let headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add auth token if available
  if (token) {
    headers = {
      ...headers,
      'Authorization': `Bearer ${token}`
    };
  }
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Chat API endpoints
export const chatApi = {
  // Send a message to the chatbot
  sendMessage: async (query: string, sessionId: string) => {
    return fetchWithAuth('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ query, sessionId }),
    });
  },
  
  // Get chat history for a session
  getHistory: async (sessionId: string) => {
    return fetchWithAuth(`/api/chat/history/${sessionId}`);
  },
  
  // Get all available sessions
  getSessions: async () => {
    return fetchWithAuth('/api/chat/sessions');
  },
  
  // Summarize a conversation
  summarizeConversation: async (sessionId: string) => {
    return fetchWithAuth(`/api/chat/summarize/${sessionId}`);
  },
  
  // Get related articles for context panel
  getRelatedArticles: async (sessionId: string) => {
    return fetchWithAuth(`/api/knowledge/related/${sessionId}`);
  }
};

// Auth API endpoints
export const authApi = {
  login: async (email: string, password: string) => {
    return fetchWithAuth('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  register: async (name: string, email: string, password: string) => {
    return fetchWithAuth('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },
  
  verify: async () => {
    return fetchWithAuth('/api/auth/verify');
  }
};

// Knowledge base API endpoints
export const knowledgeApi = {
  uploadDocuments: async (formData: FormData) => {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/knowledge/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  },
  
  getCategories: async () => {
    return fetchWithAuth('/api/knowledge/categories');
  },
  
  getDocuments: async (categoryId?: string) => {
    const endpoint = categoryId 
      ? `/api/knowledge/documents?category=${categoryId}` 
      : '/api/knowledge/documents';
    return fetchWithAuth(endpoint);
  }
};