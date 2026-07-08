import { Outlet, useLocation } from '@/lib/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

const BARE_LAYOUT_PREFIXES = ['/admin', '/dashboard', '/manager', '/consultant', '/login', '/register'];

export default function Layout() {
  const location = useLocation();
  const isBare = BARE_LAYOUT_PREFIXES.some((p) => location.pathname.startsWith(p));

  if (isBare) return <Outlet />;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
