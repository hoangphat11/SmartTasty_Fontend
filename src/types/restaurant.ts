export interface RestaurantForm {
  name: string;
  category: string;
  address: string;
  description: string;
  openTime: string; // dạng HH:mm sau khi format
  closeTime: string;
  latitude: number;
  longitude: number;
  file: File;
}
