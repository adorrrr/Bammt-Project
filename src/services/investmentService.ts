import { InvestmentOpportunity, InvestmentStatus } from '../types/investment';
import { adminService } from './adminService';

export interface InvestmentFilterOptions {
  status?: InvestmentStatus | 'all';
  category?: string;
}

export const investmentService = {
  /**
   * Fetch all investment opportunities
   */
  async getInvestments(filters?: InvestmentFilterOptions): Promise<InvestmentOpportunity[]> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    let result = adminService.getInvestments();

    if (!filters) return result;

    if (filters.status && filters.status !== 'all') {
      result = result.filter((inv) => inv.status === filters.status);
    }

    if (filters.category && filters.category !== 'সব') {
      result = result.filter((inv) => inv.category === filters.category);
    }

    return result;
  },

  /**
   * Get single investment by slug
   */
  async getInvestmentBySlug(slug: string): Promise<InvestmentOpportunity | null> {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const all = adminService.getInvestments();
    const inv = all.find((item) => item.slug === slug);
    return inv || null;
  },

  /**
   * Get featured/open opportunities for homepage
   */
  async getFeaturedInvestments(limit?: number): Promise<InvestmentOpportunity[]> {
    const open = adminService.getInvestments().filter((item) => item.status === 'open');
    return limit ? open.slice(0, limit) : open;
  }
};
