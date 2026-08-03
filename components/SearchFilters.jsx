'use client';

import { useState } from 'react';

const FIELDS = [
  'Accounting', 'Agriculture', 'Architecture & Design', 'Biology/Life Sciences',
  'Business/Management', 'Chemistry', 'Communications', 'Computer & Information Systems',
  'Computer Science', 'Data Science', 'AI & Machine Learning', 'Economics', 'Education',
  'Engineering', 'English Literature', 'Finance', 'Fine Arts', 'Health Professions',
  'History', 'Law & Legal Studies', 'Liberal Arts/Humanities', 'Marketing', 'Mathematics',
  'Medicine', 'Neuroscience', 'Nursing', 'Philosophy', 'Physics', 'Political Science',
  'Psychology', 'Public Health', 'STEM', 'All Fields', 'Other',
];

const COUNTRIES = [
  'Australia', 'Canada', 'China', 'Denmark', 'France', 'Germany', 'India', 'Ireland',
  'Italy', 'Japan', 'Netherlands', 'New Zealand', 'Singapore', 'South Korea', 'Spain',
  'Sweden', 'Switzerland', 'United Kingdom', 'United States', 'European Union', 'World',
];

const DEGREES = ['Undergraduate', 'Graduate', 'Doctoral', 'Postdoctoral', 'All Levels'];

const FUNDING = [
  { value: '', label: 'Any funding' },
  { value: 'full', label: 'Full funding' },
  { value: 'partial', label: 'Partial' },
  { value: 'tuition_only', label: 'Tuition only' },
  { value: 'stipend', label: 'Stipend' },
];

const EMPTY = {
  field: '',
  country: '',
  degree: '',
  search: '',
  funding_type: '',
  gpa: '',
  ielts: '',
  toefl: '',
  duolingo: '',
  gre: '',
  english_test: '',
  requires_gre: '',
  deadline_before: '',
};

export default function SearchFilters({ onSearch, initial = {} }) {
  const [filters, setFilters] = useState({ ...EMPTY, ...initial });
  const [showAdvanced, setShowAdvanced] = useState(
    !!(initial.ielts || initial.toefl || initial.gpa || initial.funding_type || initial.gre),
  );

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters(EMPTY);
    onSearch(EMPTY);
  };

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink">Scholarship search</h2>
          <p className="text-sm text-ink-muted">Filter by destination, funding, and your test scores.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="text-sm font-semibold text-brand-600 hover:underline"
        >
          {showAdvanced ? 'Hide score filters' : 'Show IELTS / TOEFL / GPA filters'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="field" className="label-field">Field of study</label>
            <select id="field" name="field" value={filters.field} onChange={handleChange} className="input-field">
              <option value="">All fields</option>
              {FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="country" className="label-field">Country</label>
            <select id="country" name="country" value={filters.country} onChange={handleChange} className="input-field">
              <option value="">All countries</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="degree" className="label-field">Degree level</label>
            <select id="degree" name="degree" value={filters.degree} onChange={handleChange} className="input-field">
              <option value="">All levels</option>
              {DEGREES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="funding_type" className="label-field">Funding type</label>
            <select id="funding_type" name="funding_type" value={filters.funding_type} onChange={handleChange} className="input-field">
              {FUNDING.map((f) => <option key={f.value || 'any'} value={f.value}>{f.label}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label htmlFor="search" className="label-field">Keyword</label>
            <input
              id="search"
              name="search"
              type="text"
              value={filters.search}
              onChange={handleChange}
              placeholder="University, title, eligibility..."
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="deadline_before" className="label-field">Deadline before</label>
            <input
              id="deadline_before"
              name="deadline_before"
              type="date"
              value={filters.deadline_before}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        {showAdvanced && (
          <div className="rounded-xl border border-brand-100 bg-mist/70 p-4">
            <p className="mb-3 text-sm font-semibold text-ink">
              Your scores — show programs you can meet
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label htmlFor="gpa" className="label-field">My GPA (4.0 scale)</label>
                <input id="gpa" name="gpa" type="number" step="0.1" min="0" max="4" value={filters.gpa} onChange={handleChange} className="input-field" placeholder="e.g. 3.5" />
              </div>
              <div>
                <label htmlFor="ielts" className="label-field">My IELTS band</label>
                <input id="ielts" name="ielts" type="number" step="0.5" min="0" max="9" value={filters.ielts} onChange={handleChange} className="input-field" placeholder="e.g. 6.5" />
              </div>
              <div>
                <label htmlFor="toefl" className="label-field">My TOEFL iBT</label>
                <input id="toefl" name="toefl" type="number" min="0" max="120" value={filters.toefl} onChange={handleChange} className="input-field" placeholder="e.g. 95" />
              </div>
              <div>
                <label htmlFor="duolingo" className="label-field">My Duolingo</label>
                <input id="duolingo" name="duolingo" type="number" min="0" max="160" value={filters.duolingo} onChange={handleChange} className="input-field" placeholder="e.g. 120" />
              </div>
              <div>
                <label htmlFor="gre" className="label-field">My GRE (optional)</label>
                <input id="gre" name="gre" type="number" min="260" max="340" value={filters.gre} onChange={handleChange} className="input-field" placeholder="e.g. 310" />
              </div>
              <div>
                <label htmlFor="english_test" className="label-field">Accepted English test</label>
                <select id="english_test" name="english_test" value={filters.english_test} onChange={handleChange} className="input-field">
                  <option value="">Any</option>
                  <option value="ielts">IELTS</option>
                  <option value="toefl">TOEFL</option>
                  <option value="duolingo">Duolingo</option>
                </select>
              </div>
              <div>
                <label htmlFor="requires_gre" className="label-field">GRE requirement</label>
                <select id="requires_gre" name="requires_gre" value={filters.requires_gre} onChange={handleChange} className="input-field">
                  <option value="">Any</option>
                  <option value="false">No GRE required</option>
                  <option value="true">GRE required</option>
                </select>
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-muted">
              Entering your IELTS/TOEFL/GPA hides programs above your scores so you only see realistic matches.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn-primary">Search scholarships</button>
          <button type="button" onClick={handleReset} className="btn-secondary">Reset</button>
        </div>
      </form>
    </div>
  );
}
