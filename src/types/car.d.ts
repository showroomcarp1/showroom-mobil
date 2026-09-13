export type TransmissionType = "Automatic" | "Manual";
export type FuelType = "Bensin" | "Diesel" | "Hybrid" | "Electric";
export type CarStatus = "available" | "sold";

export interface Car {
  id: string;
  slug: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  transmission: TransmissionType;
  fuel_type: FuelType;
  price: number;
  discount_price?: number;
  image_url?: string;
  images?: string[];
  description?: string;
  features?: string[];
  status: CarStatus;
  created_at?: string;
  updated_at?: string;
}