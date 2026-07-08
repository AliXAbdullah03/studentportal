import { Link } from 'react-router-dom';

export default function ScholarshipCard({ scholarship }) {
  const deadline = scholarship.deadline
    ? new Date(scholarship.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Rolling';

  return (
    <article className="card flex flex-col p-5">
      {scholarship.featured === 1 && (
        <span className="mb-2 inline-block w-fit rounded-full bg-accent-500/10 px-2.5 py-0.5 text-xs font-semibold text-accent-600">
          Featured
        </span>
      )}
      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{scholarship.title}</h3>
      <p className="mt-1 text-sm font-medium text-brand-600">{scholarship.university}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">{scholarship.country}</span>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">{scholarship.degree_level}</span>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">{scholarship.field_of_study}</span>
      </div>

      <p className="mt-3 flex-1 text-sm text-gray-600 line-clamp-3">{scholarship.description}</p>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <div>
          {scholarship.amount && (
            <p className="text-sm font-semibold text-gray-900">{scholarship.amount}</p>
          )}
          <p className="text-xs text-gray-500">Deadline: {deadline}</p>
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
