import RoadmapsList from '@/components/roadmaps/RoadmapsList';
import { getTranslations } from 'next-intl/server';

export default async function RoadmapsPage() {
  const t = await getTranslations('RoadmapsPage');
  return (
    <>
      <h1 className="text-4xl text-center font-bold">
        {t('title')}
      </h1>
      <section>
        <p className="mb-6 text-center">
          {t('description')}
        </p>
      </section>
      <section>
        <RoadmapsList />
      </section>
    </>
  );
}
