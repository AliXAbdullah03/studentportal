'use client';

import NextLink from 'next/link';
import { useRouter, useParams as useNextParams, useSearchParams as useNextSearchParams, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function Link({ to, href, children, ...props }) {
  return <NextLink href={href || to} {...props}>{children}</NextLink>;
}

export function useNavigate() {
  const router = useRouter();
  return (to, options = {}) => {
    if (options.replace) router.replace(to);
    else router.push(to);
  };
}

export function useParams() {
  return useNextParams();
}

export function useSearchParams() {
  return useNextSearchParams();
}

export function useLocation() {
  const pathname = usePathname();
  return { pathname };
}

export function Navigate({ to, replace }) {
  const router = useRouter();
  useEffect(() => {
    if (replace) router.replace(to);
    else router.push(to);
  }, [to, replace, router]);
  return null;
}

export function NavLink({ to, className, children, onClick, ...props }) {
  const pathname = usePathname();
  const isActive = pathname === to || (to !== '/' && pathname.startsWith(`${to}/`));
  const cls = typeof className === 'function' ? className({ isActive }) : className;
  return <NextLink href={to} className={cls} onClick={onClick} {...props}>{children}</NextLink>;
}
