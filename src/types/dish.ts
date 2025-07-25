export interface Dish {
  id: number;
  name: string;
  price: number;
  image: string;
  imageUrl: string; // Phải có field này
  isActive: boolean;
  category: string;
  restaurant: {
    id: number;
    name: string;
    address: string;
  };
}
