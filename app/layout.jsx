import './globals.css';
import Providers from './providers';
import AppLayout from '@/components/AppLayout';

export const metadata = {
  title: {
    default: 'Scholaris — Scholarship Consultancy',
    template: '%s | Scholaris',
  },
  description: 'Scholaris: global postgraduate mobility, research scholarships, private & government funding, and undergraduate admissions consultancy.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
