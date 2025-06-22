// Environment configuration
import bimApiList from './bimApiList';

export const config = {
  // API Configuration
  apiHost: process.env.REACT_APP_API_HOST || 'http://localhost:8080',
  apiTimeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '5000'),
  
  // Debug configuration
  debug: process.env.REACT_APP_DEBUG === 'true',
  
  // App information
  appName: 'Swagger API Client',
  version: process.env.REACT_APP_VERSION || '1.0.0',
  
  // BIM API endpoints
  bimApiList,
} as const;

// Validate required environment variables
const validateConfig = () => {
  const requiredVars = {
    'REACT_APP_API_HOST': config.apiHost,
  };

  const missing = Object.entries(requiredVars)
    .filter(([key, value]) => !value || value === 'undefined')
    .map(([key]) => key);

  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
    console.warn('Using default values. Consider creating a .env file.');
  }
};

// Run validation in development
if (process.env.NODE_ENV === 'development') {
  validateConfig();
}



// Run validation in development
if (process.env.NODE_ENV === 'development') {
  validateConfig();
}

export default config;