import { CorporateRequirement, FarmerStockSubmission } from './forms';

export type AdminRole = 'superadmin' | 'admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  phone?: string;
  lastLogin?: string;
}

export type OrderStatus =
  | 'pending'
  | 'under_review'
  | 'quoted'
  | 'confirmed'
  | 'processing'
  | 'dispatched'
  | 'completed'
  | 'cancelled';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  updatedBy: string;
  note?: string;
}

export interface BuyerOrder extends CorporateRequirement {
  orderStatus: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  quotedPricePerUnit?: number;
  totalEstimatedValue?: number;
  assignedStaff?: string;
  internalNotesList?: {
    id: string;
    author: string;
    text: string;
    createdAt: string;
  }[];
}

export interface SellerLot extends FarmerStockSubmission {
  verificationStatus: 'pending' | 'verified' | 'approved' | 'rejected';
  fieldInspectorName?: string;
  inspectionNotes?: string;
  approvedWholesalePrice?: number;
  convertedStockId?: string;
}

export interface DashboardMetrics {
  totalStocks: number;
  liveStocks: number;
  upcomingStocks: number;
  soldStocks: number;
  pendingRequirementsCount: number;
  activeOrdersCount: number;
  completedOrdersCount: number;
  pendingSellerLotsCount: number;
  totalInvestmentPledges: number;
  totalPledgedAmount: number;
  activeFundProjectsCount: number;
}

export interface ActivityLogItem {
  id: string;
  action: string;
  targetType: 'stock' | 'order' | 'seller_lot' | 'investment' | 'blog' | 'settings';
  targetTitle: string;
  actor: string;
  timestamp: string;
  details?: string;
}

export interface PlatformSettings {
  platformName: string;
  supportPhone: string;
  supportEmail: string;
  headOfficeAddress: string;
  hubLocations: string;
  defaultMoqKg: number;
  coldChainEnabled: boolean;
  allowPublicSellerSubmissions: boolean;
  allowPublicInvestorInterest: boolean;
  maintenanceMode: boolean;
}
