import { z } from "zod";

export const carSchema = z.object({
  brand: z.string().min(1, { message: "Merek mobil wajib diisi" }),
  model: z.string().min(1, { message: "Model mobil wajib diisi" }),
  variant: z.string().min(1, { message: "Varian mobil wajib diisi" }),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  transmission: z.enum(["Automatic", "Manual", "CVT"], {
    message: "Pilih transmisi yang valid",
  }),
  fuel_type: z.enum(["Bensin", "Diesel", "Hybrid", "Electric"], {
    message: "Pilih bahan bakar yang valid",
  }),
  price: z.number().min(0, { message: "Harga tidak boleh negatif" }),
  discount_price: z.number().min(0).default(0),
  description: z.string().optional(),
  features: z.array(z.string()).default([]),
  status: z.enum(["available", "sold", "reserved"]).default("available"),
});

export type CarInput = z.infer<typeof carSchema>;