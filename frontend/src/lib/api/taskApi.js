const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getTasks = async (token) => {
  const res = await fetch(`${API_BASE}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Failed to load tasks');
  return data;
};

export const submitTask = async (token, taskId, proofLink) => {
  const res = await fetch(`${API_BASE}/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ taskId, proofLink }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Failed to submit task');
  return data;
};

export const getTaskSubmissions = async (token) => {
  const res = await fetch(`${API_BASE}/submissions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Failed to load submissions');
  return data;
};
