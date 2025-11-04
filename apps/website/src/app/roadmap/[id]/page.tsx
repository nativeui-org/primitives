import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllRoadmaps, getRoadmapById } from '@/lib/roadmaps';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllRoadmaps().map((roadmap) => ({
    id: roadmap.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const roadmap = getRoadmapById(id);

  if (!roadmap) {
    return {
      title: 'Roadmap Not Found',
    };
  }

  return {
    title: `${roadmap.title} - Roadmap`,
    description: `Roadmap for ${roadmap.period}`,
  };
}

const statusStyles = {
  done: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  pending: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
};

const statusLabels = {
  done: 'Done',
  'in-progress': 'In Progress',
  pending: 'Pending',
};

export default async function RoadmapArchivePage({ params }: Props) {
  const { id } = await params;
  const roadmap = getRoadmapById(id);

  if (!roadmap) {
    notFound();
  }

  const doneCount = roadmap.components.filter((c) => c.status === 'done').length;
  const totalCount = roadmap.components.length;

  return (
    <main className="container max-w-4xl px-4 py-16 mx-auto">
      <div className="mb-8">
        <Link
          href="/roadmap"
          className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          ← Back to current roadmap
        </Link>
      </div>

      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-2">
          <h1 className="text-3xl font-bold">{roadmap.title}</h1>
          {!roadmap.active && (
            <span className="px-2 py-0.5 text-xs font-medium rounded bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
              Archived
            </span>
          )}
        </div>
        <p className="text-neutral-600 dark:text-neutral-400 mb-3">
          {roadmap.deadline}
        </p>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          {doneCount} / {totalCount} completed
        </div>
      </div>

      <div className="space-y-3">
        {roadmap.components.map((component) => (
          <div
            key={component.name}
            className="flex items-start gap-3 border-l-2 border-neutral-200 dark:border-neutral-800 pl-4"
          >
            <div className="flex-1">
              <h3 className="font-medium mb-1">{component.name}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {component.description}
              </p>
            </div>
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded whitespace-nowrap ${statusStyles[component.status]}`}
            >
              {statusLabels[component.status]}
            </span>
          </div>
        ))}
      </div>

    </main>
  );
}

