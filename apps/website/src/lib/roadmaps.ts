import octoberRoadmap from '@/data/roadmaps/october-2025.json';
import novemberRoadmap from '@/data/roadmaps/november-2025.json';

export interface Component {
  name: string;
  description: string;
  status: 'done' | 'in-progress' | 'pending';
}

export interface Roadmap {
  id: string;
  title: string;
  period: string;
  deadline: string;
  active: boolean;
  components: Component[];
}

const roadmaps: Roadmap[] = [
  octoberRoadmap as Roadmap,
  novemberRoadmap as Roadmap,
];

export function getAllRoadmaps(): Roadmap[] {
  return roadmaps;
}

export function getActiveRoadmap(): Roadmap | undefined {
  return roadmaps.find((r) => r.active);
}

export function getArchivedRoadmaps(): Roadmap[] {
  return roadmaps.filter((r) => !r.active);
}

export function getRoadmapById(id: string): Roadmap | undefined {
  return roadmaps.find((r) => r.id === id);
}

