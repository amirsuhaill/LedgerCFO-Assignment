const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Stats
export const getStats = () => req('/stats');

// Clients
export const getClients = () => req('/clients');
export const getClient = (id) => req(`/clients/${id}`);
export const createClient = (body) => req('/clients', { method: 'POST', body: JSON.stringify(body) });
export const updateClient = (id, body) => req(`/clients/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
export const deleteClient = (id) => req(`/clients/${id}`, { method: 'DELETE' });
export const getClientTasks = (id, params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return req(`/clients/${id}/tasks${qs ? `?${qs}` : ''}`);
};

// Tasks
export const getTasks = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return req(`/tasks${qs ? `?${qs}` : ''}`);
};
export const getTask = (id) => req(`/tasks/${id}`);
export const createTask = (body) => req('/tasks', { method: 'POST', body: JSON.stringify(body) });
export const updateTask = (id, body) => req(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
export const deleteTask = (id) => req(`/tasks/${id}`, { method: 'DELETE' });
