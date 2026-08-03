'use client';

import { Link } from '@/lib/navigation';

function reqChips(s) {
  const chips = [];
  if (s.min_gpa != null) chips.push(`GPA ${s.min_gpa}+`);
  if (s.min_ielts != null) chips.push(`IELTS ${s.min_ielts}+`);
  if (s.min_toefl != null) chips.push(`TOEFL ${s.min_toefl}+`);
  if (s.min_duolingo != null) chips.push(`Duolingo ${s.min_duolingo}+`);
  if (s.requires_gre || s.min_gre != null) chips.push(s.min_gre ? `GRE ${s.min_gre}+` : 'GRE required');
  if (s.funding_type && s.funding_type !== 'unknown') {
    chips.push(s.funding_type.replace('_', ' '));
  }
  return chips;
}

export default function ScholarshipCard({ scholarship }) {
  const deadline = scholarship.deadline
    ? new Date(scholarship.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Rolling';
  const requirements = reqChips(scholarship);

  return (
    <article className="card flex flex-col p-5">
      {scholarship.featured === 1 && (
        <span className="mb-2 inline-block w-fit rounded-full bg-accent-500/10 px-2.5 py-0.5 text-xs font-semibold text-accent-600">
          Featured
        </span>
      )}
      <h3 className="text-lg font-semibold text-ink line-clamp-2">{scholarship.title}</h3>
      <p className="mt-1 text-sm font-medium text-brand-600">{scholarship.university}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-mist px-2.5 py-0.5 text-xs text-ink-soft">{scholarship.country}</span>
        <span className="rounded-full bg-mist px-2.5 py-0.5 text-xs text-ink-soft">{scholarship.degree_level}</span>
        <span className="rounded-full bg-mist px-2.5 py-0.5 text-xs text-ink-soft">{scholarship.field_of_study}</span>
      </div>

      {requirements.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {requirements.map((r) => (
            <span key={r} className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold capitalize text-brand-700">
              {r}
            </span>
          ))}
        </div>
      )}

      <p className="mt-3 flex-1 text-sm text-ink-muted line-clamp-3">
        {scholarship.description || scholarship.description_preview}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
        <div>
          {scholarship.amount && (
            <p className="text-sm font-semibold text-ink">{scholarship.amount}</p>
          )}
          <p className="text-xs text-ink-muted">Deadline: {deadline}</p>
        </div>
        <Link
          to={`/scholarships/${scholarship.id}`}
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          View details &rarr;
        </Link>
      </div>
    </article>
  );
}
