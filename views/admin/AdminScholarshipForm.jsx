'use client';

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from '@/lib/navigation';
import { api } from '@/lib/api';

const EMPTY = {
  title: '', university: '', country: '', field_of_study: '', degree_level: '',
  amount: '', deadline: '', description: '', eligibility: '', benefits: '',
  application_url: '', featured: false, status: 'active',
};

const FIELDS = [
  'Accounting', 'Agriculture', 'Architecture & Design', 'Biology/Life Sciences',
  'Business/Management', 'Chemistry', 'Communications', 'Computer & Information Systems',
  'Economics', 'Education', 'Engineering', 'STEM', 'All Fields', 'Other',
];

const DEGREES = ['Undergraduate', 'Graduate', 'Doctoral', 'Postdoctoral', 'All Levels'];

export default function AdminScholarshipForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      api.scholarships.get(id)
        .then((s) => setForm({ ...s, featured: s.featured === 1 }))
        .catch(() => setError('Scholarship not found'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        await api.scholarships.update(id, form);
      } else {
        await api.scholarships.create(form);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <h1 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Scholarship' : 'Add New Scholarship'}
          </h1>
          <Link to="/admin" className="btn-secondary text-sm">&larr; Back to Dashboard</Link>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <div className="card space-y-5 p-6">
          <h2 className="font-semibold text-gray-900">Basic Information</h2>

          <div>
            <label htmlFor="title" className="label-field">Scholarship Title *</label>
            <input id="title" name="title" required value={form.title} onChange={handleChange} className="input-field" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="university" className="label-field">University / Organization *</label>
              <input id="university" name="university" required value={form.university} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="country" className="label-field">Country *</label>
              <input id="country" name="country" required value={form.country} onChange={handleChange} className="input-field" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="field_of_study" className="label-field">Field of Study *</label>
              <select id="field_of_study" name="field_of_study" required value={form.field_of_study} onChange={handleChange} className="input-field">
                <option value="">Select field</option>
                {FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="degree_level" className="label-field">Degree Level *</label>
              <select id="degree_level" name="degree_level" required value={form.degree_level} onChange={handleChange} className="input-field">
                <option value="">Select level</option>
                {DEGREES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="amount" className="label-field">Award Amount</label>
              <input id="amount" name="amount" value={form.amount} onChange={handleChange} className="input-field" placeholder="e.g. Full tuition, $5,000" />
            </div>
            <div>
              <label htmlFor="deadline" className="label-field">Application Deadline</label>
              <input id="deadline" name="deadline" type="date" value={form.deadline} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </div>

        <div className="card space-y-5 p-6">
          <h2 className="font-semibold text-gray-900">Details</h2>

          <div>
            <label htmlFor="description" className="label-field">Description *</label>
            <textarea id="description" name="description" required rows={4} value={form.description} onChange={handleChange} className="input-field" />
          </div>

          <div>
            <label htmlFor="eligibility" className="label-field">Eligibility Requirements</label>
            <textarea id="eligibility" name="eligibility" rows={3} value={form.eligibility} onChange={handleChange} className="input-field" />
          </div>

          <div>
            <label htmlFor="benefits" className="label-field">Benefits</label>
            <textarea id="benefits" name="benefits" rows={3} value={form.benefits} onChange={handleChange} className="input-field" />
          </div>

          <div>
            <label htmlFor="application_url" className="label-field">External Application URL</label>
            <input id="application_url" name="application_url" type="url" value={form.application_url} onChange={handleChange} className="input-field" />
          </div>
        </div>

        <div className="card space-y-5 p-6">
          <h2 className="font-semibold text-gray-900">Settings</h2>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
              Featured scholarship
            </label>

            <div>
              <label htmlFor="status" className="label-field">Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange} className="input-field w-auto">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? 'Saving...' : isEdit ? 'Update Scholarship' : 'Create Scholarship'}
          </button>
          <Link to="/admin" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
