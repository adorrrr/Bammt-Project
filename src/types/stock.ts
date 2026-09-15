export type StockStatus = 'live' | 'upcoming' | 'sold';
export type PriceType = 'fixed' | 'negotiable' | 'contact';

export interface StockSpecificationItem {
  label: string;
  value: string;
}

export interface Stock {
  id: string;
  slug: string;
  productName: string;
  banglaName: string;
  category: string;
  status: StockStatus;
  quantity: number;
  unit: string;
  location: string;
  district: string;
  division: string;
  availabilityDate?: string;
  grade?: string;
  harvestDate?: string;
  packaging?: string;
  minimumOrder?: number;
  price?: number;
  priceType?: PriceType;
  description: string;
  images: string[];
  specifications?: StockSpecificationItem[];
  originDetails?: {
    unionOrVillage?: string;
    farmerGroup?: string;
    farmingMethod?: string;
  };
  logistics?: {
    warehouseReady?: boolean;
    transportAssistance?: boolean;
    estimatedDeliveryDays?: string;
  };
  featured?: boolean;
}
