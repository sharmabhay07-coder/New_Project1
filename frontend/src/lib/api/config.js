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

export const API_BASE_URL = apiBaseUrl.replace(/\/+$/, '');
