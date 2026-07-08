'use client';

import { Link } from '@/lib/navigation';

const GUIDES = [
  {
    title: 'How to Get an International Scholarship',
    summary: 'A complete roadmap from research to acceptance for students planning to study abroad.',
    sections: [
      'Start early — most scholarships have deadlines 6-12 months before your program starts.',
      'Research thoroughly using filters for your field, country, and degree level.',
      'Build a strong academic profile with good grades, test scores, and extracurricular activities.',
      'Prepare compelling application materials including personal statements and recommendation letters.',
      'Apply to multiple scholarships to increase your chances of success.',
    ],
  },
  {
    title: 'Writing a Winning Scholarship Essay',
    summary: 'Tips and strategies for crafting essays that stand out to scholarship committees.',
    sections: [
      'Understand the prompt and address every part of the question directly.',
      'Tell your unique story — committees want to know who you are beyond grades.',
      'Be specific about your goals and how the scholarship will help you achieve them.',
      'Show impact — demonstrate how your studies will benefit your community or field.',
      'Proofread carefully and have others review your essay before submitting.',
    ],
  },
  {
    title: 'Scholarships for International Students in the U.S.',
    summary: 'Key funding opportunities for non-U.S. citizens pursuing education in America.',
    sections: [
      'University-specific merit scholarships — many U.S. schools offer aid to international students.',
      'Private organizations like MPOWER, Fulbright, and EducationUSA provide dedicated funding.',
      'Field-specific awards exist for STEM, business, arts, and other disciplines.',
      'Graduate assistantships and research positions can cover tuition and living expenses.',
      'Combine multiple smaller awards to build a comprehensive funding package.',
    ],
  },
  {
    title: 'Preparing Your Application Documents',
    summary: 'Essential documents you need for most international scholarship applications.',
    sections: [
      'Academic transcripts (official, translated if necessary)',
      'Standardized test scores (TOEFL, IELTS, GRE, SAT as required)',
      'Letters of recommendation from professors or employers',
      'Statement of Purpose or personal essay',
      'CV/Resume highlighting achievements and experience',
      'Proof of financial need (for need-based scholarships)',
    ],
  },
];

export default function Guidance() {
  return (
    <div>
      <section className="bg-gradient-to-br from-brand-800 to-brand-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold">Guidance Center</h1>
          <p className="mt-4 text-lg text-brand-100 max-w-2xl mx-auto">
            Expert resources to help you navigate the scholarship application process successfully.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          {GUIDES.map((guide) => (
            <article key={guide.title} className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900">{guide.title}</h2>
              <p className="mt-2 text-gray-600">{guide.summary}</p>
              <ol className="mt-6 space-y-3">
                {guide.sections.map((section, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-700">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                      {i + 1}
                    </span>
                    {section}
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-brand-50 border-y border-brand-100 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="section-title">Need Personalized Help?</h2>
          <p className="mt-4 text-gray-600">
            Our mentorship consultants provide one-on-one guidance tailored to your specific situation.
          </p>
          <Link to="/mentorship" className="btn-primary mt-6 inline-flex">Book a Consultation</Link>
        </div>
      </section>
    </div>
  );
}
