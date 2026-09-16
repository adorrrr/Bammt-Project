export type BlogContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'link'; href: string; label: string; description: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: BlogContentBlock[];
  category: string;
  featuredImage: string;
  imageAlt: string;
  author: string;
  publishedAt: string; // ISO date, e.g. 2026-08-12
  updatedAt?: string;
  readingTime: string; // e.g. "৬ মিনিট পড়া"
  seoTitle: string;
  seoDescription: string;
  keywords?: string[];
  featured?: boolean;
}
