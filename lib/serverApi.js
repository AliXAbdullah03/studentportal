const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function getScholarships(params = {}) {
  const query = new URLSearchParams({ phd_only: 'true', ...params }).toString();
  const res = await fetch(`${API_BASE}/scholarships?${query}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch scholarships');
  const data = await res.json();
  return { scholarships: data.scholarships || data, total: data.total || (data.scholarships || data).length };
}

export async function getScholarship(id) {
  const res = await fetch(`${API_BASE}/scholarships/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export async function getScholarshipStats() {
  const res = await fetch(`${API_BASE}/scholarships/stats`, { next: { revalidate: 300 } });
  if (!res.ok) return { total: 0, phd_count: 0 };
  return res.json();
}
