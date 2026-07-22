'use client';

import { Link } from '@/lib/navigation';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-brand-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm">
                SC
              </div>
              <span className="text-lg font-bold text-white">Scholaris</span>
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              Scholarship consultancy &amp; postgraduate placement — research, private university, government funding, and undergraduate admissions.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/scholarships" className="hover:text-white transition">Scholarships</Link></li>
              <li><Link to="/mentorship" className="hover:text-white transition">Mentorship</Link></li>
              <li><Link to="/plans" className="hover:text-white transition">Service Plans</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:contact@scholaris.com" className="hover:text-white transition">Contact Us</a></li>
              <li><Link to="/policies" className="hover:text-white transition">Policies</Link></li>
              <li><Link to="/mentorship" className="hover:text-white transition">Book Consultation</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-brand-900 pt-6 text-center text-xs text-gray-500">
          <p>Global Postgraduate Mobility &amp; Scholarship Consultancy</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} Scholaris. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
