const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetches recent activity data for the current user.
 * In the future, this will hit a dedicated backend endpoint.
 *
 * @param {string} token - The user's authentication token.
 * @returns {Promise<Array>} - A promise that resolves to an array of activity items.
 */
export const getRecentActivity = async (token) => {
  // const res = await fetch(`${API_BASE}/activity`, {
  //   headers: { Authorization: `Bearer ${token}` },
  // });
  // const data = await res.json().catch(() => ({}));
  // if (!res.ok) throw new Error(data?.message || 'Failed to load activities');
  // return data;

  // TODO: Remove this mock when the backend endpoint is ready.
  return Promise.resolve([]);
};
