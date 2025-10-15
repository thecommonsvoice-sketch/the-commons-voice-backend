import { ArticleStatus } from "@prisma/client";

export interface VideoData {
  type: 'upload' | 'embed';
  url: string;
  title?: string | null;
  description?: string | null;
}

export interface ArticleData {
  title: string;
  content: string;
  slug: string;
  categoryId: string;
  coverImage: string | null;
  metaTitle: string;
  metaDescription: string;
  status: ArticleStatus;
  authorId: string;
  videos?: {
    create: VideoData[];
  };
}