'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode, type CSSProperties } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { LeftSidebar } from '@/components/grok/LeftSidebar';
import { ClientOnly } from './ClientOnly';

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const noSidebarRoutes = ['/login', '/signup', '/verify-email'];
  const showSidebar = !noSidebarRoutes.includes(pathname);

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '260px',
          '--sidebar-width-icon': '80px',
        } as CSSProperties
      }
    >
      <ClientOnly>
        <LeftSidebar />
      </ClientOnly>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
