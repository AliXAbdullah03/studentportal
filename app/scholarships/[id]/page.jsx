import { getScholarship } from '@/lib/serverApi';
import ScholarshipDetail from '@/views/ScholarshipDetail';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const s = await getScholarship(id);
  if (!s) return { title: 'Scholarship Not Found' };
  const desc = (s.description || s.description_preview || '').slice(0, 160);
  return {
    title: s.title,
    description: desc,
    openGraph: { title: s.title, description: desc },
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  const scholarship = await getScholarship(id);
  if (!scholarship) notFound();
  return <ScholarshipDetail initialScholarship={scholarship} />;
}
