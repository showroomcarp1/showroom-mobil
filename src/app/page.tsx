import { redirect } from "next/navigation";

export default function Home() {
  // Langsung alihkan ke halaman /cars
  redirect("/cars");

  // Komponen fallback visual jika ada delay transisi
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#b89563]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
    </div>
  );
}
