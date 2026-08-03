'use client';

import { Link } from '@/lib/navigation';

export default function Footer() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 font-bold text-white">
                SC
              </div>
              <span className="font-display text-xl font-bold text-white">Scholaris</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65">
              Scholarship consultancy and postgraduate placement — research, private university funding,
              government schemes, and undergraduate admissions.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-300">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/scholarships" className="hover:text-white">Scholarships</Link></li>
              <li><Link to="/plans" className="hover:text-white">Service Plans</Link></li>
              <li><Link to="/mentorship" className="hover:text-white">Mentorship</Link></li>
              <li><Link to="/about" className="hover:text-white">About</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-300">Support</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="mailto:contact@scholaris.com" className="hover:text-white">Contact Us</a></li>
              <li><Link to="/policies" className="hover:text-white">Policies</Link></li>
              <li><Link to="/guidance/request" className="hover:text-white">Free Consultation</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/45">
          <p>Global Postgraduate Mobility &amp; Scholarship Consultancy</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} Scholaris. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
