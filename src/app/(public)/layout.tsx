import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header Navigation */}
      <Navbar />

      {/* Konten Halaman */}
      <div className="flex-1">{children}</div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
