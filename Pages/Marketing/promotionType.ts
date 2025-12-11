// promotionTypes.ts
export interface ProductConfig {
  search: string;
  quantity?: number;
  discount?: number;
}

export type PromotionType = 'fixedPrice' | 'discountX%' | 'onePlusOne' | 'carousel' | 'totalAmount';

export interface PromotionConfig {
  type: PromotionType;
  name?: string;
  startHour?: string;
  endDateCheckbox?: boolean;
  products?: ProductConfig[];
  discountPercent?: number;
  discountAmount?: number;
  buyCount?: number;
  receiveCount?: number;
  receiveDiscount?: number;
  levels?: { discountPercent: number }[];
}
