import { API_BASE_URL } from './config';

export const getDashboardSummary = async (token) => {
    const res = await fetch(`${API_BASE_URL}/users/dashboard`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || 'Failed to fetch referrals');
    }

    return data;
};
