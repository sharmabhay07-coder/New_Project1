const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || 'Something went wrong. Please try again.');
  }
  return data;
}

export const loginUser = ({ email, password }) =>
  request('/auth/login', { email, password });

export const registerUser = ({ name, email, password, mobile, referralCode }) =>
  request('/auth/register', { name, email, password, mobile, referralCode });

export const googleAuth = (credential) =>
  request('/auth/google', { credential });
