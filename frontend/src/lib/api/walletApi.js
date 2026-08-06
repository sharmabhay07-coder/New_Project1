const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const createWithdrawal = async (token, payload) => {
  const res = await fetch(`${API_BASE}/withdrawals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || 'Withdrawal failed');
  return data;
};
