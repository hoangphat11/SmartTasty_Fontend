export enum DishCategory {
  Buffet = 0,
  ThucAn = 1,
  NuocUong = 2,
  ThucAnThem = 3,
}



export interface Dish {
  name: string;
  category: DishCategory;
  description?: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
  restaurantId: number;
}
