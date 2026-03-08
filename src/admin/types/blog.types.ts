export type BlogStatus = "published" | "draft" | "archived";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  tags: string[];
  status: BlogStatus;
  excerpt: string;
  content: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  views: number;
}

export type ModalMode = "create" | "edit" | "view" | null;
export type FilterStatus = "all" | BlogStatus;
