import { Fraunces, Outfit } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import AppLayout from '@/components/AppLayout';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
});

const sans = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  title: {
    default: 'Scholaris — Scholarship Consultancy',
    template: '%s | Scholaris',
  },
  description: 'Scholaris: global postgraduate mobility, research scholarships, private & government funding, and undergraduate admissions consultancy.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
