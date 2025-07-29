export interface RestaurantForm {
  name: string;
  category: string;
  address: string;
  description: string;
  openTime: string;
  closeTime: string;
  latitude: number;
  longitude: number;
  file: File;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
