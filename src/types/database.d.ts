import { CarStatus, ConditionType, FuelType, TransmissionType } from "./cars";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      cars: {
        Row: {
          id: string;
          slug: string;
          title: string;
          brand: string;
          model: string;
          variant: string;
          year: number;
          condition: ConditionType;
          mileage: number | null;
          transmission: TransmissionType;
          fuel_type: FuelType;
          price: number;
          discount_price: number | null;
          image_url: string | null;
          images: string[] | null;
          exterior_images: string[] | null;
          interior_images: string[] | null;
          description: string | null;
          features: string[] | null;
          status: CarStatus;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          brand: string;
          model: string;
          variant?: string;
          year: number;
          condition?: ConditionType;
          mileage?: number | null;
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
          status?: CarStatus;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          brand?: string;
          model?: string;
          variant?: string;
          year?: number;
          condition?: ConditionType;
          mileage?: number | null;
          transmission?: TransmissionType;
          fuel_type?: FuelType;
          price?: number;
          discount_price?: number | null;
          image_url?: string | null;
          images?: string[] | null;
          exterior_images?: string[] | null;
          interior_images?: string[] | null;
          description?: string | null;
          features?: string[] | null;
          status?: CarStatus;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_car_views: {
        Args: {
          car_id: string;
        };
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
