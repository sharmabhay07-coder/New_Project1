const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const getDashboardSummary = async (token) => {
    const res = await fetch(`${API_BASE}/users/dashboard`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || 'Failed to load dashboard summary');
    }

    return data;
};