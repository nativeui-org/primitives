import type { Metadata } from 'next';
import Link from 'next/link';
import { getActiveRoadmap, getArchivedRoadmaps } from '@/lib/roadmaps';

export const metadata: Metadata = {
  title: 'Roadmap',
  description: 'Upcoming components for NativeUI Primitives',
};

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

export default function RoadmapPage() {
  const activeRoadmap = getActiveRoadmap();
  const archivedRoadmaps = getArchivedRoadmaps();

  if (!activeRoadmap) {
    return null;
  }

  const doneCount = activeRoadmap.components.filter((c) => c.status === 'done').length;
  const totalCount = activeRoadmap.components.length;

  return (
    <main className="container max-w-4xl px-4 py-16 mx-auto">
      <div className="mb-12">
        <div className="flex items-baseline gap-3 mb-2">
          <h1 className="text-3xl font-bold">Roadmap</h1>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {activeRoadmap.period}
          </span>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400 mb-3">
          {activeRoadmap.deadline}
        </p>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">
          {doneCount} / {totalCount} completed
        </div>
      </div>

      <div className="space-y-3">
        {activeRoadmap.components.map((component) => (
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

      {archivedRoadmaps.length > 0 && (
        <div className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <h2 className="text-sm font-semibold mb-3">Archive</h2>
          <div className="space-y-2">
            {archivedRoadmaps.map((roadmap) => (
              <Link
                key={roadmap.id}
                href={`/roadmap/${roadmap.id}`}
                className="block text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                {roadmap.title} →
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-16 pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
          Have a suggestion? Join the discussion on GitHub.
        </p>
        <a
          href="https://github.com/nativeui-org/primitives/discussions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline underline-offset-4 hover:no-underline"
        >
          GitHub Discussions →
        </a>
      </div>
    </main>
  );
}

