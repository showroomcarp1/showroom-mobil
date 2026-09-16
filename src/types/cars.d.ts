export type ConditionType = "New" | "Used" | "Exclusive";
export type TransmissionType = "Automatic" | "Manually" | "CVT";
export type FuelType = "Petrol" | "Diesel" | "Hybrid" | "Electric";
export type CarStatus = "available" | "sold" | "reserved";

export const CONDITION_OPTIONS: ConditionType[] = ["New", "Used", "Exclusive"];
export const TRANSMISSION_OPTIONS: TransmissionType[] = [
  "Automatic",
  "Manually",
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
  mileage?: number | string;
  transmission: TransmissionType;
  fuel_type: FuelType;
  price: number;
  discount_price?: number;
  image_url?: string;
  images?: string[];
  description?: string;
  features?: string[];
  status: CarStatus;
  views?: number;
  created_at?: string;
  updated_at?: string;
}
