'use client';

import { useState } from 'react';

const FIELDS = [
  'Accounting', 'Agriculture', 'Architecture & Design', 'Biology/Life Sciences',
  'Business/Management', 'Chemistry', 'Communications', 'Computer & Information Systems',
  'Economics', 'Education', 'Engineering', 'English Literature', 'Finance',
  'Fine Arts', 'Health Professions', 'History', 'Law & Legal Studies',
  'Liberal Arts/Humanities', 'Marketing', 'Mathematics', 'Medicine', 'Nursing',
  'Philosophy', 'Physics', 'Political Science', 'Psychology', 'STEM', 'All Fields', 'Other',
];

const COUNTRIES = [
  'Australia', 'Canada', 'China', 'France', 'Germany', 'India', 'Italy', 'Japan',
  'Netherlands', 'New Zealand', 'Singapore', 'South Korea', 'Spain', 'Sweden',
  'Switzerland', 'United Kingdom', 'United States', 'European Union', 'World',
];

const DEGREES = ['Undergraduate', 'Graduate', 'Doctoral', 'Postdoctoral', 'All Levels'];

export default function SearchFilters({ onSearch, initial = {} }) {
  const [filters, setFilters] = useState({
    field: initial.field || '',
    country: initial.country || '',
    degree: initial.degree || '',
    search: initial.search || '',
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    const empty = { field: '', country: '', degree: '', search: '' };
    setFilters(empty);
    onSearch(empty);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-gray-900">Quick Scholarship Search</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="field" className="label-field">What are you studying?</label>
          <select id="field" name="field" value={filters.field} onChange={handleChange} className="input-field">
            <option value="">All Fields</option>
            {FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="country" className="label-field">Where are you studying?</label>
          <select id="country" name="country" value={filters.country} onChange={handleChange} className="input-field">
            <option value="">All Countries</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="degree" className="label-field">Degree Level</label>
          <select id="degree" name="degree" value={filters.degree} onChange={handleChange} className="input-field">
            <option value="">All Levels</option>
            {DEGREES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="search" className="label-field">Keyword Search</label>
          <input
            id="search"
            name="search"
            type="text"
            value={filters.search}
            onChange={handleChange}
            placeholder="University, title..."
            className="input-field"
          />
        </div>

        <div className="flex gap-3 sm:col-span-2 lg:col-span-4">
          <button type="submit" className="btn-primary">Search</button>
          <button type="button" onClick={handleReset} className="btn-secondary">Reset</button>
        </div>
      </form>
    </div>
  );
}
