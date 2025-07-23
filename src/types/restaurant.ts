export interface RestaurantPayload {
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  openTime: string;
  closeTime: string;
  imageUrl?: string;
}

export interface Restaurant extends RestaurantPayload {
  id: number;
  ownerId: number;
  ownerEmail: string;
  ownerName: string;
  ownerPhone: string;
  imagePublicId: string | null;
  status: "pending" | "approved" | "rejected";
  isHidden: boolean;
  createdAt: string;
  distanceKm?: number | null;
}
