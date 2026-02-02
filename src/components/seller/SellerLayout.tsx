import { ReactNode } from 'react';
import { SellerSidebar } from './SellerSidebar';
import { SellerHeader } from './SellerHeader';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

interface SellerLayoutProps {
  children: ReactNode;
}

export const SellerLayout = ({ children }: SellerLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <SellerSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <SellerHeader />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
