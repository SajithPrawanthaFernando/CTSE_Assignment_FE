// src/components/shared/HeaderSkeleton.tsx
export const HeaderSkeleton = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm px-6 py-3">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        {/* Logo Placeholder */}
        <div className="flex-1">
          <div className="w-32 h-8 bg-gray-200 animate-pulse rounded-lg" />
        </div>

        {/* Nav Placeholder */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-16 h-4 bg-gray-100 animate-pulse rounded"
            />
          ))}
        </div>

        {/* Icons Placeholder */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="w-10 h-10 bg-gray-100 animate-pulse rounded-full" />
          <div className="w-10 h-10 bg-gray-100 animate-pulse rounded-full" />
          <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-full" />
        </div>
      </div>
    </header>
  );
};
