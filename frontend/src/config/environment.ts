// Environment configuration
const config = {
    // API URLs
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
    aiServiceUrl: process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:8000',
    
    // Authentication settings
    authStorageKey: process.env.REACT_APP_AUTH_STORAGE_KEY || 'authToken',
    sessionStorageKey: process.env.REACT_APP_SESSION_STORAGE_KEY || 'lastChatSession',
    
    // Feature flags
    features: {
      enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
      enableSocialLogin: process.env.REACT_APP_ENABLE_SOCIAL_LOGIN === 'true',
      enableMocks: process.env.REACT_APP_ENABLE_MOCKS === 'true',
    },
    
    // Default settings
    defaults: {
      theme: process.env.REACT_APP_DEFAULT_THEME || 'light',
    },
    
    // Environment information
    environment: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    isTest: process.env.NODE_ENV === 'test',
  };
  
  export default config;