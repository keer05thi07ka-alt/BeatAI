const BASE_URL = '/api';
const BACKEND_URL = 'http://127.0.0.1:8000/api';

let currentUserEmail = 'demo@beat.health';

export const setUserEmail = (email) => {
  if (email) {
    currentUserEmail = email;
  } else {
    currentUserEmail = 'demo@beat.health';
  }
};

async function fetchWithFallback(endpoint, options = {}) {
  const headers = {
    'X-User-Email': currentUserEmail,
    ...(options.headers || {})
  };

  const reqOptions = {
    ...options,
    headers
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, reqOptions);
    if (res.ok) return await res.json();
    const errorData = await res.json().catch(() => null);
    const msg = errorData?.detail || `Error ${res.status}`;
    throw new Error(msg);
  } catch (err) {
    if (err.message && !err.message.includes('fetch') && !err.message.includes('Proxy')) {
      throw err;
    }
    console.warn(`Proxy fetch failed for ${endpoint}, trying direct backend URL...`, err.message);
    const res = await fetch(`${BACKEND_URL}${endpoint}`, reqOptions);
    if (res.ok) return await res.json();
    const errorData = await res.json().catch(() => null);
    const msg = errorData?.detail || `Direct backend error ${res.status}`;
    throw new Error(msg);
  }
}

export const api = {
  login: (email, password) => fetchWithFallback('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }),
  register: (name, email, password) => fetchWithFallback('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  }),
  getHealth: () => fetchWithFallback('/health'),
  getReports: () => fetchWithFallback('/reports'),
  getReportById: (id) => fetchWithFallback(`/reports/${id}`),
  deleteReport: (id) => fetchWithFallback(`/reports/${id}`, { method: 'DELETE' }),
  uploadReport: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetchWithFallback('/reports/upload', {
      method: 'POST',
      body: formData,
    });
  },
  compareReports: (prevId, latestId) => fetchWithFallback(`/reports/compare?prev_id=${prevId}&latest_id=${latestId}`),
  getTrends: () => fetchWithFallback('/history/trends'),
  chatAssistant: (query, reportId) => fetchWithFallback('/assistant/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, report_id: reportId }),
  }),
  getKnowledge: () => fetchWithFallback('/knowledge'),
  seedSample: () => fetchWithFallback('/reports/seed-sample', { method: 'POST' }),
};
