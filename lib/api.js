const API_BASE = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL)
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')
  : '/api';
const TOKEN_KEY = 'auth_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.error || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function requestForm(path, formData, method = 'POST') {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { method, headers, body: formData });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

async function downloadFile(path, filename) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) throw new Error('Download failed');

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const api = {
  auth: {
    register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    me: () => request('/auth/me'),
  },
  users: {
    listStaff: () => request('/users/staff'),
    listStudents: () => request('/users/students'),
    createStaff: (data) => request('/users/staff', { method: 'POST', body: JSON.stringify(data) }),
    updateStaff: (id, data) => request(`/users/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteStaff: (id) => request(`/users/staff/${id}`, { method: 'DELETE' }),
  },
  scholarships: {
    list: async (params = {}) => {
      const query = new URLSearchParams({ phd_only: 'true', ...params }).toString();
      const data = await request(`/scholarships?${query}`);
      if (Array.isArray(data)) return data;
      return { scholarships: data.scholarships, total: data.total, phd_only: data.phd_only };
    },
    stats: () => request('/scholarships/stats'),
    get: (id) => request(`/scholarships/${id}`),
    fields: () => request('/scholarships/fields'),
    countries: () => request('/scholarships/countries'),
    adminAll: () => request('/scholarships/admin/all'),
    create: (data) => request('/scholarships', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/scholarships/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/scholarships/${id}`, { method: 'DELETE' }),
  },
  applications: {
    submit: (data) => request('/applications', { method: 'POST', body: JSON.stringify(data) }),
    mine: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/applications/mine${q ? `?${q}` : ''}`);
    },
    get: (id) => request(`/applications/${id}`),
    addNote: (id, data) => request(`/applications/${id}/notes`, { method: 'POST', body: JSON.stringify(data) }),
    uploadDocument: (id, formData) => requestForm(`/applications/${id}/documents`, formData),
    downloadDocument: (id, docId, filename = 'document') =>
      downloadFile(`/applications/${id}/documents/${docId}/download`, filename),
    list: () => request('/applications'),
    board: () => request('/applications/board'),
    moveBoard: (id, data) => request(`/applications/${id}/board`, { method: 'PATCH', body: JSON.stringify(data) }),
    updateStatus: (id, status, note) =>
      request(`/applications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note }),
      }),
    createGroup: (data) => request('/applications/board/groups', { method: 'POST', body: JSON.stringify(data) }),
    updateGroup: (key, data) => request(`/applications/board/groups/${key}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteGroup: (key) => request(`/applications/board/groups/${key}`, { method: 'DELETE' }),
  },
  match: {
    calculate: (data) => request('/match', { method: 'POST', body: JSON.stringify(data) }),
    calculateFull: (data) => request('/match/full', { method: 'POST', body: JSON.stringify(data) }),
  },
  guidance: {
    request: (formData) => requestForm('/guidance/request', formData),
    list: () => request('/guidance'),
    downloadDossier: (id) => downloadFile(`/guidance/${id}/dossier`, `dossier-${id}.pdf`),
    updateStatus: (id, status) => request(`/guidance/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
  plans: {
    list: () => request('/plans'),
    adminAll: () => request('/plans/admin/all'),
    create: (data) => request('/plans', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/plans/${id}`, { method: 'DELETE' }),
  },
  orders: {
    create: (plan_id) => request('/orders', { method: 'POST', body: JSON.stringify({ plan_id }) }),
    pay: (id, data) => request(`/orders/${id}/pay`, { method: 'POST', body: JSON.stringify(data) }),
    mine: () => request('/orders/mine'),
    list: () => request('/orders'),
    updateStatus: (id, payment_status) => request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ payment_status }) }),
  },
  messages: {
    send: (data) => request('/messages/send', { method: 'POST', body: JSON.stringify(data) }),
    list: () => request('/messages'),
  },
  crm: {
    overview: () => request('/crm/overview'),
    traffic: () => request('/crm/traffic'),
    assignments: () => request('/crm/assignments'),
    getAssignment: (id) => request(`/crm/assignments/${id}`),
    createAssignment: (data) => request('/crm/assignments', { method: 'POST', body: JSON.stringify(data) }),
    forward: (id) => request(`/crm/assignments/${id}/forward`, { method: 'POST' }),
    assign: (id, consultant_id) => request(`/crm/assignments/${id}/assign`, { method: 'POST', body: JSON.stringify({ consultant_id }) }),
    toggleMilestone: (id, is_completed) => request(`/crm/milestones/${id}`, { method: 'PATCH', body: JSON.stringify({ is_completed }) }),
    consultantCapacity: () => request('/crm/consultants/capacity'),
    myStatus: () => request('/crm/my-status'),
  },
  consultant: {
    overview: () => request('/consultant/overview'),
    getAvailability: () => request('/consultant/availability'),
    saveAvailability: (data) => request('/consultant/availability', { method: 'PUT', body: JSON.stringify(data) }),
    calendar: (from, to) => {
      const q = new URLSearchParams();
      if (from) q.set('from', from);
      if (to) q.set('to', to);
      const s = q.toString();
      return request(`/consultant/calendar${s ? `?${s}` : ''}`);
    },
    sessions: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/consultant/sessions${q ? `?${q}` : ''}`);
    },
    getSession: (id) => request(`/consultant/sessions/${id}`),
    createSession: (data) => request('/consultant/sessions', { method: 'POST', body: JSON.stringify(data) }),
    updateSession: (id, data) => request(`/consultant/sessions/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    addSessionNote: (id, body) => request(`/consultant/sessions/${id}/notes`, { method: 'POST', body: JSON.stringify({ body }) }),
    earnings: () => request('/consultant/earnings'),
    payouts: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/consultant/payouts${q ? `?${q}` : ''}`);
    },
    requestPayout: (data) => request('/consultant/payouts', { method: 'POST', body: JSON.stringify(data) }),
    processPayout: (id, data) => request(`/consultant/payouts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
  mentorship: {
    submit: (data) => request('/mentorship', { method: 'POST', body: JSON.stringify(data) }),
    list: () => request('/mentorship'),
    updateStatus: (id, status) => request(`/mentorship/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
  profile: {
    me: () => request('/profile/me'),
    update: (data) => request('/profile/me', { method: 'PUT', body: JSON.stringify(data) }),
    uploadDocuments: (formData) => requestForm('/profile/me/documents', formData),
    recommendations: (limit = 12) => request(`/profile/recommendations?limit=${limit}`),
  },
};

export function setAuthToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

export function getDashboardPath(role) {
  switch (role) {
    case 'admin': return '/admin';
    case 'manager': return '/manager';
    case 'consultant': return '/consultant';
    case 'student': return '/dashboard';
    default: return '/';
  }
}

/** Post-auth landing: students with incomplete profiles go to onboarding first. */
export function getPostAuthPath(user) {
  if (!user) return '/login';
  if (user.role === 'student' && user.onboarding_completed === false) return '/onboarding';
  return getDashboardPath(user.role);
}

export function formatPrice(cents, currency = 'PKR') {
  const amount = Number(cents) || 0;
  if (amount === 0) return 'Free';
  const value = amount / 100;
  if (currency === 'USD') {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `Rs. ${value.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
}

export const PLAN_CATEGORY_META = [
  { id: 'research', label: 'Research / PhD', blurb: 'Fixed-fee and comprehensive research scholarship plans.' },
  { id: 'private', label: 'Private University', blurb: 'Privately funded postgraduate scholarships.' },
  { id: 'government', label: 'Government Funding', blurb: 'Embassy and ministry full-funding schemes.' },
  { id: 'undergraduate', label: 'Undergraduate', blurb: 'Admission placement only — scholarships not guaranteed.' },
];


export function saveMatchProfile(profile) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('match_profile', JSON.stringify(profile));
  }
}

export function getMatchProfile() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem('match_profile') || '{}');
  } catch {
    return {};
  }
}
