export default function Loading() {
  return (
    <main className="bg-white pt-3 lg:pt-6 pb-28 lg:pb-20 min-h-screen animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <div className="aspect-[16/10] w-full bg-neutral-200 rounded-lg" />
        </div>
        <div className="lg:col-span-5 space-y-4">
          <div className="h-8 bg-neutral-200 rounded w-3/4" />
          <div className="h-10 bg-neutral-200 rounded w-1/2" />
          <div className="h-32 bg-neutral-100 rounded w-full mt-6" />
        </div>
      </div>
    </main>
  );
}
