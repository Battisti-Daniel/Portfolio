export interface BlogPostSummary {
  id: number;
  title: string;
  slug: string;
  summary: string;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
}

export interface BlogPost extends BlogPostSummary {
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostRequest {
  title: string;
  slug?: string;
  summary: string;
  content: string;
  tags: string[];
  published: boolean;
}
