const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // handles both { message: '...' } and { errors: [{ msg: '...' }] }
    const message =
      data?.message ||
      data?.errors?.[0]?.msg ||
      'Something went wrong. Please try again.';
    throw new Error(message);
  }

  return data;
}

export const registerUser = ({ name, email, password, mobileNumber, referralCode }) =>
  request('/auth/register', { name, email, mobileNumber, password, referralCode });

export const sendOtp = ({ userId }) =>
  request('/auth/send-otp', { userId });

export const verifyOtp = ({ userId, otp }) =>
  request('/auth/verify-otp', { userId, otp });

export const loginUser = ({ identifier, password }) =>
  request('/auth/login', { identifier, password });