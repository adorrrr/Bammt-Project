export type InvestmentStatus = 'open' | 'funded' | 'closed';

export interface InvestmentTimelineStep {
  stage: number;
  title: string;
  duration: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
}

export interface InvestmentOpportunity {
  id: string;
  slug: string;
  stockId?: string;
  title: string;
  productName: string;
  category: string;
  location: string;
  requiredCapital: number;
  raisedCapital: number;
  minimumInvestment: number;
  profitPercentage: number;
  durationDays: number;
  startDate?: string;
  settlementDate?: string;
  status: InvestmentStatus;
  description: string;
  procurementPlan: {
    targetQuantity: number;
    unit: string;
    sourceRegion: string;
    targetBuyers: string;
    purchaseWindow: string;
    salesWindow: string;
  };
  timeline: InvestmentTimelineStep[];
  risks?: string[];
  securityAndCompliance?: string[];
  images: string[];
  investorCount?: number;
}
