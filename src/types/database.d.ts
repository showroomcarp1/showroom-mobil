import { CarStatus, ConditionType, FuelType, TransmissionType } from "./cars";

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
          description: string | null;
          features: string[] | null;
          status: CarStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["cars"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          condition?: ConditionType;
        };
        Update: Partial<Database["public"]["Tables"]["cars"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
