export default function Loading() {
  return (
    <main className="bg-neutral-950 pt-20 sm:pt-24 lg:pt-28 pb-28 lg:pb-20 min-h-screen text-neutral-100">
      {/* 1. Breadcrumb Skeleton */}
      <nav aria-label="Breadcrumb" className="bg-neutral-950 py-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-3 w-12 bg-neutral-800 rounded-xs relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
            <div className="h-2 w-2 bg-neutral-800 rounded-full" />
            <div className="h-3 w-16 bg-neutral-800 rounded-xs relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
            <div className="h-2 w-2 bg-neutral-800 rounded-full" />
            <div className="h-3 w-14 bg-neutral-800 rounded-xs relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
            <div className="h-2 w-2 bg-neutral-800 rounded-full" />
            <div className="h-3 w-32 bg-neutral-800 rounded-xs relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="space-y-12">
          {/* 2. Top Section (Gallery & Header Info) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Image Gallery Skeleton */}
            <section className="lg:col-span-7 space-y-3">
              <div className="aspect-[16/10] w-full bg-neutral-900 border border-neutral-800 rounded-xs relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
              {/* Thumbnail strip */}
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] w-20 bg-neutral-900 border border-neutral-800 rounded-xs relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"
                  />
                ))}
              </div>
            </section>

            {/* Right Column: Title, Price, & Key Specs */}
            <section className="lg:col-span-5 space-y-6">
              {/* Header Title & Price */}
              <div className="space-y-3 border-b border-neutral-800 pb-5">
                {/* Title */}
                <div className="h-8 sm:h-10 bg-neutral-800 rounded-xs w-5/6 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />

                {/* Price Label & Value */}
                <div className="pt-2 space-y-2">
                  <div className="h-3 w-12 bg-neutral-800 rounded-xs relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1/2 bg-neutral-800 rounded-xs relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
                    <div className="h-5 w-20 bg-neutral-800 rounded-xs relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
                  </div>
                </div>
              </div>

              {/* Specification Table Skeleton */}
              <div className="divide-y divide-neutral-800/60 border-y border-neutral-800">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="h-4 w-24 bg-neutral-800 rounded-xs relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
                    <div className="h-4 w-20 bg-neutral-800 rounded-xs relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* 3. Bottom Section (Tabs & Description Box) */}
          <div className="space-y-8 border-t border-neutral-800 pt-6">
            {/* Sticky Tabs Navbar Skeleton */}
            <div className="sticky top-16 sm:top-20 z-20 bg-neutral-950/90 backdrop-blur-md py-3 border-b border-neutral-800">
              <div className="flex items-center gap-8 overflow-x-auto whitespace-nowrap scrollbar-none px-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-5 w-28 bg-neutral-800 rounded-xs relative overflow-hidden flex-shrink-0 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"
                  />
                ))}
              </div>
            </div>

            {/* Description Block Skeleton */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-3 rounded-xs">
              <div className="h-6 w-40 bg-neutral-800 rounded-xs relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full bg-neutral-800/80 rounded-xs relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
                <div className="h-4 w-5/6 bg-neutral-800/80 rounded-xs relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
                <div className="h-4 w-2/3 bg-neutral-800/80 rounded-xs relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
