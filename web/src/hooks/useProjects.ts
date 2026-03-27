import { useQuery } from '@tanstack/react-query';
import type { ProjectConfig } from '@veritas-kanban/shared';
import { useManagedList } from './useManagedList';
import { apiFetch } from '@/lib/api/helpers';

/**
 * Hook to fetch projects (active only)
 */
export function useProjects() {
  return useQuery<ProjectConfig[]>({
    queryKey: ['projects'],
    queryFn: () => apiFetch<ProjectConfig[]>('/api/projects'),
  });
}

/**
 * Hook to manage projects (CRUD operations)
 */
export function useProjectsManager() {
  return useManagedList<ProjectConfig>({
    endpoint: '/projects',
    queryKey: ['projects'],
  });
}

/**
 * Get the label for a project
 */
export function getProjectLabel(projects: ProjectConfig[], projectId: string): string {
  const project = projects.find((p) => p.id === projectId);
  return project?.label || projectId;
}

/**
 * Get the color class for a project badge
 */
export function getProjectColor(projects: ProjectConfig[], projectId: string): string {
  const project = projects.find((p) => p.id === projectId);
  return project?.color || 'bg-muted';
}

/**
 * Get the left border color class for a project (for TaskCard stripe)
 */
export function getProjectBorderColor(
  projects: ProjectConfig[],
  projectId: string
): string | undefined {
  const bgColor = getProjectColor(projects, projectId);
  return AVAILABLE_PROJECT_COLORS.find((c) => c.value === bgColor)?.borderColor;
}

/**
 * Available background colors for project badges
 */
export const AVAILABLE_PROJECT_COLORS = [
  { value: 'bg-blue-500/20', label: 'Blue', borderColor: 'border-l-blue-500' },
  { value: 'bg-green-500/20', label: 'Green', borderColor: 'border-l-green-500' },
  { value: 'bg-purple-500/20', label: 'Purple', borderColor: 'border-l-purple-500' },
  { value: 'bg-orange-500/20', label: 'Orange', borderColor: 'border-l-orange-500' },
  { value: 'bg-pink-500/20', label: 'Pink', borderColor: 'border-l-pink-500' },
  { value: 'bg-cyan-500/20', label: 'Cyan', borderColor: 'border-l-cyan-500' },
  { value: 'bg-amber-500/20', label: 'Amber', borderColor: 'border-l-amber-500' },
  { value: 'bg-rose-500/20', label: 'Rose', borderColor: 'border-l-rose-500' },
  { value: 'bg-indigo-500/20', label: 'Indigo', borderColor: 'border-l-indigo-500' },
  { value: 'bg-teal-500/20', label: 'Teal', borderColor: 'border-l-teal-500' },
];
