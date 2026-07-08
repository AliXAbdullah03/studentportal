import './globals.css';
import Providers from './providers';
import AppLayout from '@/components/AppLayout';

export const metadata = {
  title: {
    default: 'Global PhD Scholarships Hub',
    template: '%s | Global PhD Scholarships Hub',
  },
  description: 'Discover 1,000+ fully funded PhD scholarships worldwide. Test your match percentage before signup and get expert guidance.',
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
