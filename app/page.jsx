import { getScholarshipStats } from '@/lib/serverApi';
import Home from '@/views/Home';

export default async function Page() {
  const stats = await getScholarshipStats();
  return <Home initialStats={stats} />;
}
