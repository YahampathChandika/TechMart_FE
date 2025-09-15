// app/(customer)/layout.js
export default function CustomerLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Customer pages use the default layout with header/footer from root layout */}
      {children}
    </div>
  );
}
