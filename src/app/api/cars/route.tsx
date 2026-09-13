import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: Mengambil daftar mobil dari Supabase Database
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: cars, error } = await supabase.from("cars").select("*").order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: cars }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}