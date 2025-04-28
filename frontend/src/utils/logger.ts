import config from '../config/environment';

// Log levels
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Logger configuration
const loggerConfig = {
  minLevel: config.isProduction ? 'warn' : 'debug',
  enableConsole: !config.isProduction || config.features.enableMocks,
  enableRemote: config.isProduction && config.features.enableAnalytics,
};

// Remote logging endpoint - would be integrated with a service like Sentry or LogRocket
const sendRemoteLog = async (level: LogLevel, message: string, data?: any) => {
  if (!loggerConfig.enableRemote) return;
  
  try {
    await fetch(`${config.apiUrl}/api/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level,
        message,
        data,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }),
    });
  } catch (error) {
    // Fallback to console if remote logging fails
    console.error('Failed to send log to remote endpoint:', error);
  }
};

// Logger implementation
const logger = {
  debug: (message: string, data?: any) => {
    if (!shouldLog('debug')) return;
    
    if (loggerConfig.enableConsole) {
      console.debug(`[DEBUG] ${message}`, data);
    }
    
    if (loggerConfig.enableRemote) {
      sendRemoteLog('debug', message, data);
    }
  },
  
  info: (message: string, data?: any) => {
    if (!shouldLog('info')) return;
    
    if (loggerConfig.enableConsole) {
      console.info(`[INFO] ${message}`, data);
    }
    
    if (loggerConfig.enableRemote) {
      sendRemoteLog('info', message, data);
    }
  },
  
  warn: (message: string, data?: any) => {
    if (!shouldLog('warn')) return;
    
    if (loggerConfig.enableConsole) {
      console.warn(`[WARN] ${message}`, data);
    }
    
    if (loggerConfig.enableRemote) {
      sendRemoteLog('warn', message, data);
    }
  },
  
  error: (message: string, error?: any) => {
    if (!shouldLog('error')) return;
    
    if (loggerConfig.enableConsole) {
      console.error(`[ERROR] ${message}`, error);
    }
    
    if (loggerConfig.enableRemote) {
      sendRemoteLog('error', message, error);
    }
  },
};

// Helper to determine if we should log at this level
function shouldLog(level: LogLevel): boolean {
  const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
  const minLevelIndex = levels.indexOf(loggerConfig.minLevel as LogLevel);
  const currentLevelIndex = levels.indexOf(level);
  
  return currentLevelIndex >= minLevelIndex;
}

export default logger;