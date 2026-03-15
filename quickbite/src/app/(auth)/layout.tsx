export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-24 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* 1. Background Image */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center z-0" />

      {/* 2. White Backdrop Blur - Reduced opacity to 70% for better contrast with Header */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-md z-10"></div>

      {/* 3. Form Container - Added a subtle shadow and border for depth */}
      <div className="relative z-20 w-full max-w-lg space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
        {children}
      </div>
    </div>
  );
}
