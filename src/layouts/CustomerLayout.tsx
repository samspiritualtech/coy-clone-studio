import { Header } from "@/components/Header";
import { LuxuryFooter } from "@/components/LuxuryFooter";

interface CustomerLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

export const CustomerLayout = ({ children, hideHeader, hideFooter }: CustomerLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!hideHeader && <Header />}
      <main className="flex-1">{children}</main>
      {!hideFooter && <LuxuryFooter />}
    </div>
  );
};
