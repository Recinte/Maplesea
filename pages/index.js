import Head from 'next/head';
import dynamic from 'next/dynamic';

const MapleSEAStatsTracker = dynamic(() => import('../components/MapleSEAStatsTracker'), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>MapleStorySEA Tracker</title>
        <meta name="description" content="Track MapleSEA player stats with OpenAPI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen bg-gray-100 p-6">
        <MapleSEAStatsTracker />
      </main>
    </>
  );
}