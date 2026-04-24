export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh overflow-x-hidden overflow-y-auto bg-[#fafafa]">
      {children}
    </main>
  );
}

