export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F5F5F5]">
      <div className="max-w-6xl mx-auto px-6">{children}</div>
    </div>
  );
}
