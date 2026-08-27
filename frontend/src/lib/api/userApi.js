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

export const getAdminUsers = async (token) => {
    const res = await fetch(`${API_BASE}/users/admin/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || 'Failed to load users');
    }

    return data;
};

export const updateAdminUser = async (token, id, updates) => {
    const res = await fetch(`${API_BASE}/users/admin/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || 'Failed to update user');
    }

    return data;
};

export const deleteAdminUser = async (token, id) => {
    const res = await fetch(`${API_BASE}/users/admin/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || 'Failed to delete user');
    }

    return data;
};

export const getLeaderboard = async (token) => {
    const res = await fetch(`${API_BASE}/leaderboard`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || 'Failed to load leaderboard');
    }

    return data;
};

export const getMe = async (token) => {
    const res = await fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || 'Failed to load user profile');
    }

    return data;
};