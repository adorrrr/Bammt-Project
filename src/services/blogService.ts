import { BlogPost } from '../types/blog';
import { adminService } from './adminService';

export interface BlogFilterOptions {
  category?: string;
  query?: string;
}

export const blogService = {
  /**
   * Fetch all blog posts, optionally filtered by category and/or search query.
   */
  async getPosts(filters?: BlogFilterOptions): Promise<BlogPost[]> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const allPosts = adminService.getBlogPosts();
    let result = [...allPosts].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    if (!filters) return result;

    if (filters.category && filters.category !== 'সব') {
      result = result.filter((post) => post.category === filters.category);
    }

    if (filters.query && filters.query.trim() !== '') {
      const q = filters.query.trim().toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.category.toLowerCase().includes(q)
      );
    }

    return result;
  },

  /**
   * Get a single article by its SEO-friendly slug.
   */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const allPosts = adminService.getBlogPosts();
    const post = allPosts.find((item) => item.slug === slug);
    return post || null;
  },

  /**
   * Get the featured (hero) article for the blog landing page.
   */
  async getFeaturedPost(): Promise<BlogPost | null> {
    const allPosts = adminService.getBlogPosts();
    const featured = allPosts.find((post) => post.featured);
    return featured || allPosts[0] || null;
  },

  /**
   * Get related articles by shared category, excluding the current slug.
   */
  async getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
    const allPosts = adminService.getBlogPosts();
    const current = allPosts.find((item) => item.slug === slug);
    if (!current) return [];

    const sameCategory = allPosts.filter(
      (post) => post.slug !== slug && post.category === current.category
    );
    const others = allPosts.filter(
      (post) => post.slug !== slug && post.category !== current.category
    );

    return [...sameCategory, ...others].slice(0, limit);
  },

  /**
   * Distinct list of categories present across all articles.
   */
  getCategories(): string[] {
    const allPosts = adminService.getBlogPosts();
    return Array.from(new Set(allPosts.map((post) => post.category)));
  },
};
