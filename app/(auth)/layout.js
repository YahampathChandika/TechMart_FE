// app/(auth)/layout.js
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Auth pages have a cleaner layout without header/footer distractions */}
      <div className="relative">
        {/* Optional background pattern or branding */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
