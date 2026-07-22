'use client';

import { Link } from '@/lib/navigation';

export default function Policies() {
  return (
    <div>
      <section className="bg-gradient-to-br from-brand-800 to-brand-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-200">Scholaris</p>
          <h1 className="mt-2 text-4xl font-bold">Policies &amp; Guidelines</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-100">
            Corporate rules governing the 2026–2027 consultancy cycle.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6 lg:px-8">
          <PolicyBlock title="Outcome Disclaimer">
            <p>
              Scholaris provides expert advisory, document preparation, and application execution services.
              Scholarship outcomes, admissions decisions, and visa approvals are the sole prerogative of the
              respective institutions and government bodies. Scholaris makes no guarantees of acceptance or funding.
            </p>
            <p className="mt-3">
              Undergraduate services are for <strong>admission placement only</strong>. Scholarships and financial aid are not guaranteed.
            </p>
          </PolicyBlock>

          <PolicyBlock title="Letters of Recommendation (LOR)">
            <p>
              The client bears sole responsibility for coordinating with professors, corporate supervisors, or
              high-school teachers/counselors to obtain signed, stamped, and dated letters on official institutional letterhead.
              Client will provide all required LORs independently.
            </p>
          </PolicyBlock>

          <PolicyBlock title="Prerequisite Tests">
            <p>
              The client is solely responsible for completing any required English proficiency tests
              (IELTS, TOEFL, Duolingo), HAT, or equivalent standardized assessments mandated by target institutions
              or scholarship bodies.
            </p>
          </PolicyBlock>

          <PolicyBlock title="Document Uploads &amp; Execution Queue">
            <p>
              Applications will not enter the execution queue for portal submission until all prerequisite documents
              have been safely uploaded to the client&apos;s designated internal drive folder.
            </p>
          </PolicyBlock>

          <PolicyBlock title="Retainer &amp; Financial Recovery Policy">
            <p>Scholaris operates on a strict tiered retainer for catalog plans:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Advance Committal Fee — 60%</strong> due immediately upon registration. Profile mapping,
                CV layout, and SOP conceptualization will not commence until this balance is cleared.
              </li>
              <li>
                <strong>Portal Submission Clearance — 40%</strong> must be settled immediately before the first
                official university or scholarship portal account is finalized for submission.
              </li>
            </ul>
          </PolicyBlock>

          <PolicyBlock title="Research / PhD Milestone Plans (Tiers 3–5)">
            <p>
              Comprehensive research packages split payment into Milestone 1 (upfront) and Milestone 2 (interview phase).
              If a client fails to reach the interview phase, Milestone 2 is forfeited. Milestone 1 (after the 15% Treasury
              deduction for internal operations) remains distributable per Scholaris profit-sharing protocol.
            </p>
          </PolicyBlock>

          <PolicyBlock title="Non-Refundability">
            <p>
              All fees paid to Scholaris are strictly non-refundable once a service phase has commenced.
            </p>
          </PolicyBlock>

          <PolicyBlock title="Confidentiality &amp; Data Handling">
            <p>
              All client information, academic records, financial details, and communication exchanged with Scholaris
              are treated as strictly confidential. Client data will never be shared with third parties without express
              written consent. Scholaris maintains secure digital storage for all client files throughout and beyond
              the active engagement cycle.
            </p>
          </PolicyBlock>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-600">
            <p>Questions about a specific package?</p>
            <Link to="/plans" className="mt-3 inline-flex btn-primary">View Service Plans</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PolicyBlock({ title, children }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <div className="mt-3 text-gray-600 leading-relaxed">{children}</div>
    </div>
  );
}
