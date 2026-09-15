export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
  techStack: string[];
  featured: boolean;
  displayOrder: number;
  createdAt: string;
}

export type ProjectRequest = Omit<Project, 'id' | 'createdAt'>;
