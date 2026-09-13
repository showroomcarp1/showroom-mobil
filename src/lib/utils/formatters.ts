// Format angka ke format Rupiah (IDR)
export const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

// Generate URL slug otomatis dari nama merek, model, dan varian
export const generateSlug = (brand: string, model: string, variant: string): string => {
  const text = `${brand} ${model} ${variant}`;
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};