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
