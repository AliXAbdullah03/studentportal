'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import AuthModal from './AuthModal';

const BARE_LAYOUT_PREFIXES = ['/admin', '/dashboard', '/manager', '/consultant', '/login', '/register'];

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const isBare = BARE_LAYOUT_PREFIXES.some((p) => pathname.startsWith(p));

  if (isBare) {
    return (
      <>
        {children}
        <AuthModal />
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <AuthModal />
    </div>
  );
}
