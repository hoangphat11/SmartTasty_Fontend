export interface Dish {
  id: number;
  name: string;
  price: number;
  image: string;
  imageUrl: string; 
  isActive: boolean;
  category: string;
  restaurant: {
    id: number;
    name: string;
    address: string;
  };
}
