const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, body = null, method = 'POST') {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
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

export const sendOtp = ({ registrationId, email }) => {
  const body = {};
  if (registrationId) body.registrationId = registrationId;
  if (email) body.email = email;
  return request('/auth/send-otp', body);
};

export const verifyOtp = ({ registrationId, email, otp }) => {
  const body = { otp };
  if (registrationId) body.registrationId = registrationId;
  if (email) body.email = email;
  return request('/auth/verify-otp', body);
};

export const loginUser = ({ identifier, password }) =>
  request('/auth/login', { identifier, password });

export const googleAuth = async () => {
  throw new Error('Google sign-in is not available yet.');
};
