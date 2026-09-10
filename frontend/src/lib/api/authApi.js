import { API_BASE_URL } from './config';

async function request(path, body = null, method = 'POST') {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, options);
  } catch (error) {
    // This catches network errors, including CORS issues or DNS failures
    throw new Error('Network error or CORS issue: Failed to reach the server. Please check your connection or CORS configuration.');
  }

  let data;
  try {
    data = await res.json();
  } catch (error) {
    data = {};
  }

  if (!res.ok) {
    const message =
      data?.message ||
      data?.errors?.[0]?.msg ||
      `HTTP Error ${res.status}: ${res.statusText}`;
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
