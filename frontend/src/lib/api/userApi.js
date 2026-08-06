const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

export const getMyBalance = async (token) => {
    const res = await fetch(`${API_BASE}/users/my-balance`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || 'Failed to load balance');
    }

    return data;
};

export const getMySubmissions = async (token) => {
    const res = await fetch(`${API_BASE}/users/my-submissions`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || 'Failed to load submissions');
    }

    return data;
};