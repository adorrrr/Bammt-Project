import { Stock, StockStatus } from '../types/stock';
import { adminService } from './adminService';

export interface StockFilterOptions {
  category?: string;
  status?: StockStatus | 'all';
  district?: string;
  searchQuery?: string;
}

export const stockService = {
  /**
   * Fetch all stocks (with optional filters)
   */
  async getStocks(filters?: StockFilterOptions): Promise<Stock[]> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    
    let result = adminService.getStocks();

    if (!filters) return result;

    if (filters.status && filters.status !== 'all') {
      result = result.filter((stock) => stock.status === filters.status);
    }

    if (filters.category && filters.category !== 'সব') {
      result = result.filter((stock) => stock.category === filters.category);
    }

    if (filters.district && filters.district !== 'সব জেলা') {
      result = result.filter((stock) => stock.district === filters.district);
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (stock) =>
          stock.banglaName.toLowerCase().includes(query) ||
          stock.productName.toLowerCase().includes(query) ||
          stock.location.toLowerCase().includes(query) ||
          stock.category.toLowerCase().includes(query)
      );
    }

    return result;
  },

  /**
   * Get single stock by slug
   */
  async getStockBySlug(slug: string): Promise<Stock | null> {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const stocks = adminService.getStocks();
    const stock = stocks.find((item) => item.slug === slug || item.id === slug);
    return stock || null;
  },

  /**
   * Get live/available stocks
   */
  async getLiveStocks(limit?: number): Promise<Stock[]> {
    const stocks = adminService.getStocks();
    const live = stocks.filter((item) => item.status === 'live');
    return limit ? live.slice(0, limit) : live;
  },

  /**
   * Get upcoming stocks
   */
  async getUpcomingStocks(limit?: number): Promise<Stock[]> {
    const stocks = adminService.getStocks();
    const upcoming = stocks.filter((item) => item.status === 'upcoming');
    return limit ? upcoming.slice(0, limit) : upcoming;
  },

  /**
   * Get available categories for filtering
   */
  async getCategories(): Promise<string[]> {
    const stocks = adminService.getStocks();
    const categories = Array.from(new Set(stocks.map((s) => s.category)));
    return ['সব', ...categories];
  }
};
