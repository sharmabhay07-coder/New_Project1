const apiBaseUrl = import.meta.env.VITE_API_URL;

const isLocalhostUrl = (value) => {
  try {
    const { hostname } = new URL(value);
    return hostname === 'localhost'
      || hostname === '127.0.0.1'
      || hostname.startsWith('127.')
      || hostname === '[::1]';
  } catch {
    return false;
  }
};

if (!apiBaseUrl) {
  throw new Error('VITE_API_URL is required');
}

if (import.meta.env.PROD && isLocalhostUrl(apiBaseUrl)) {
  throw new Error('VITE_API_URL must not point to localhost in production');
}

let finalApiUrl = apiBaseUrl;

// Force localhost for local development so it doesn't hit the broken Render deployment
if (!import.meta.env.PROD && !isLocalhostUrl(apiBaseUrl)) {
  console.warn('Forcing API to localhost for local development to avoid Render deployment issues.');
  finalApiUrl = 'http://localhost:5000/api';
}

export const API_BASE_URL = finalApiUrl.replace(/\/+$/, '');
