export default function Loading() {
  return (
    <main className="bg-white pt-3 lg:pt-6 pb-28 lg:pb-20 min-h-screen">
      {/* 1. Breadcrumb Skeleton */}
      <nav aria-label="Breadcrumb" className="bg-white py-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-3 w-12 bg-neutral-200 rounded relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
            <div className="h-2 w-2 bg-neutral-200 rounded-full" />
            <div className="h-3 w-16 bg-neutral-200 rounded relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
            <div className="h-2 w-2 bg-neutral-200 rounded-full" />
            <div className="h-3 w-14 bg-neutral-200 rounded relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
            <div className="h-2 w-2 bg-neutral-200 rounded-full" />
            <div className="h-3 w-32 bg-neutral-200 rounded relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="space-y-12">
          {/* 2. Top Section (Gallery & Header Info) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Image Gallery Skeleton */}
            <section className="lg:col-span-7 space-y-3">
              <div className="aspect-[16/10] w-full bg-neutral-200 rounded-lg relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
              {/* Thumbnail strip */}
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] w-20 bg-neutral-200 rounded relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent"
                  />
                ))}
              </div>
            </section>

            {/* Right Column: Title, Price, & Key Specs */}
            <section className="lg:col-span-5 space-y-6">
              {/* Header Title & Price */}
              <div className="space-y-3 border-b border-neutral-100 pb-5">
                {/* Title */}
                <div className="h-8 sm:h-10 bg-neutral-200 rounded w-5/6 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />

                {/* Price Label & Value */}
                <div className="pt-2 space-y-1">
                  <div className="h-3 w-12 bg-neutral-200 rounded relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1/2 bg-neutral-200 rounded relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
                    <div className="h-5 w-20 bg-neutral-200 rounded relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
                  </div>
                </div>
              </div>

              {/* Specification Table Skeleton */}
              <div className="divide-y divide-neutral-100 border-y border-neutral-100">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="h-4 w-24 bg-neutral-200 rounded relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
                    <div className="h-4 w-20 bg-neutral-200 rounded relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* 3. Bottom Section (Tabs & Description Box) */}
          <div className="space-y-8 border-t border-neutral-100 pt-6">
            {/* Tabs Header */}
            <div className="flex items-center gap-8 border-b border-neutral-100 pb-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-5 w-24 bg-neutral-200 rounded relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent"
                />
              ))}
            </div>

            {/* Description Block Skeleton */}
            <div className="bg-[#f2f2f2] p-6 space-y-3">
              <div className="h-6 w-40 bg-neutral-300 rounded relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full bg-neutral-300 rounded relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
                <div className="h-4 w-5/6 bg-neutral-300 rounded relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
                <div className="h-4 w-2/3 bg-neutral-300 rounded relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
