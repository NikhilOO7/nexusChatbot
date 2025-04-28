// Environment configuration
const config = {
    // API URLs
    apiUrl: import.meta.env.REACT_APP_API_URL || 'http://localhost:3000',
    aiServiceUrl: import.meta.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:8000',
    
    // Authentication settings
    authStorageKey: import.meta.env.REACT_APP_AUTH_STORAGE_KEY || 'authToken',
    sessionStorageKey: import.meta.env.REACT_APP_SESSION_STORAGE_KEY || 'lastChatSession',
    
    // Feature flags
    features: {
      enableAnalytics: import.meta.env.REACT_APP_ENABLE_ANALYTICS === 'true',
      enableSocialLogin: import.meta.env.REACT_APP_ENABLE_SOCIAL_LOGIN === 'true',
      enableMocks: import.meta.env.REACT_APP_ENABLE_MOCKS === 'true',
    },
    
    // Default settings
    defaults: {
      theme: import.meta.env.REACT_APP_DEFAULT_THEME || 'light',
    },
    
    // Environment information
    environment: import.meta.env.NODE_ENV || 'development',
    isProduction: import.meta.env.NODE_ENV === 'production',
    isDevelopment: import.meta.env.NODE_ENV === 'development',
    isTest: import.meta.env.NODE_ENV === 'test',
  };
  
  export default config;