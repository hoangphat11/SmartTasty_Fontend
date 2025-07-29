export interface Promotion {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  restaurantId: number;
  restaurant?: {
    id: number;
    name: string;
    address: string;
  };
}

export interface PromotionForm {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  restaurantId: number;
}
