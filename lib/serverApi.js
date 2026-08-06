function resolveApiBase() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }
  if (process.env.BACKEND_URL) {
    return `${process.env.BACKEND_URL.replace(/\/$/, '')}/api`;
  }
  return 'http://localhost:5000/api';
}

const API_BASE = resolveApiBase();

async function safeFetch(url, options) {
  try {
    return await fetch(url, options);
  } catch (err) {
    // Build/prerender on Vercel has no local backend — don't crash the build
    console.warn(`[serverApi] fetch failed for ${url}:`, err?.cause?.code || err.message);
    return null;
  }
}

export async function getScholarships(params = {}) {
  const query = new URLSearchParams({ phd_only: 'true', ...params }).toString();
  const res = await safeFetch(`${API_BASE}/scholarships?${query}`, { next: { revalidate: 60 } });
  if (!res?.ok) return { scholarships: [], total: 0 };
  const data = await res.json().catch(() => ({}));
  return {
    scholarships: data.scholarships || data || [],
    total: data.total || (data.scholarships || data || []).length || 0,
  };
}

export async function getScholarship(id) {
  const res = await safeFetch(`${API_BASE}/scholarships/${id}`, { next: { revalidate: 60 } });
  if (!res?.ok) return null;
  return res.json().catch(() => null);
}

export async function getScholarshipStats() {
  const res = await safeFetch(`${API_BASE}/scholarships/stats`, { next: { revalidate: 300 } });
  if (!res?.ok) return { total: 0, phd_count: 0 };
  return res.json().catch(() => ({ total: 0, phd_count: 0 }));
}
