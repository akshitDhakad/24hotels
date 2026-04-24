import { PublicFooter } from "@/components/layout/public-footer";

export default function HotelsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <PublicFooter />
    </>
  );
}

