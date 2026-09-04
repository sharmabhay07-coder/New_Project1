const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getTasks = async (token) => {
  const res = await fetch(`${API_BASE}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Failed to load tasks');
  return data;
};

export const startTask = async (token, taskId) => {
  const res = await fetch(`${API_BASE}/submissions/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ taskId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Failed to start task');
  return data;
};

export const submitTask = async (token, taskId, proofFile, submissionNote = "", verificationCode = "") => {
  const formData = new FormData();
  formData.append('taskId', taskId);
  formData.append('file', proofFile);
  formData.append('submissionNote', submissionNote);
  formData.append('verificationCode', verificationCode);

  const res = await fetch(`${API_BASE}/submissions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
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

export const adminCreateTask = async (token, taskData) => {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Failed to create task');
  return data;
};

export const reviewTaskSubmission = async (token, submissionId, status, reviewNote = "") => {
  const res = await fetch(`${API_BASE}/submissions/${submissionId}/review`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status, reviewNote }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Failed to review submission');
  return data;
};
