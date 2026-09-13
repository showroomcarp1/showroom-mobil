import { CarStatus, FuelType, TransmissionType } from "./car";

export interface Database {
  public: {
    Tables: {
      cars: {
        Row: {
          id: string;
          slug: string;
          brand: string;
          model: string;
          variant: string;
          year: number;
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
        >;
        Update: Partial<Database["public"]["Tables"]["cars"]["Insert"]>;
      };
    };
  };
}
