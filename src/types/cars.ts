export type ConditionType = "New" | "Used" | "Exclusive";
export type TransmissionType =
  | "Automatic Transmission"
  | "Manual Transmission"
  | "CVT";
export type FuelType = "Petrol" | "Diesel" | "Hybrid" | "Electric";

// TAMBAHKAN "booked" DI SINI:
export type CarStatus = "available" | "booked" | "sold" | "reserved";

export const CONDITION_OPTIONS: ConditionType[] = ["New", "Used", "Exclusive"];
export const TRANSMISSION_OPTIONS: TransmissionType[] = [
  "Automatic Transmission",
  "Manual Transmission",
  "CVT",
];
export const FUEL_OPTIONS: FuelType[] = [
  "Petrol",
  "Diesel",
  "Hybrid",
  "Electric",
];

export interface Car {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  condition: ConditionType;
  mileage?: number | string | null;
  transmission: TransmissionType;
  fuel_type: FuelType;
  price: number;
  discount_price?: number | null;
  image_url?: string | null;
  images?: string[] | null;
  exterior_images?: string[] | null;
  interior_images?: string[] | null;
  description?: string | null;
  features?: string[] | null;
  status: CarStatus;
  views: number;
  created_at: string;
  updated_at: string;
}
