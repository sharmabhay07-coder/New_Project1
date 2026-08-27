const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getVideos = async (token) => {
    const res = await fetch(`${API_BASE}/videos`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || 'Failed to load videos');
    }

    return data;
};

export const getAdminVideos = async (token, status) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';

    const res = await fetch(`${API_BASE}/videos/admin/all${query}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || 'Failed to load admin videos');
    }

    return data;
};

export const approveAdminVideo = async (token, id) => {
    const res = await fetch(`${API_BASE}/videos/admin/${id}/approve`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || 'Failed to approve video');
    }

    return data;
};

export const rejectAdminVideo = async (token, id) => {
    const res = await fetch(`${API_BASE}/videos/admin/${id}/reject`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || 'Failed to reject video');
    }

    return data;
};

export const uploadVideo = async (formData, token) => {
    const res = await fetch(`${API_BASE}/videos`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || 'Failed to upload video');
    }

    return data;
};

export const deleteAdminVideo = async (token, id) => {
    const res = await fetch(`${API_BASE}/videos/admin/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || 'Failed to delete video');
    }

    return data;
};