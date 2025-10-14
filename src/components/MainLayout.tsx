'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode, type CSSProperties } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { LeftSidebar } from '@/components/grok/LeftSidebar';
import { ClientOnly } from './ClientOnly';
import { PanelLeft } from 'lucide-react';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

function Header() {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
        <SidebarTrigger>
          <PanelLeft className="h-5 w-5" />
        </SidebarTrigger>
        <Link href="/" className="flex items-center gap-2">
            <h1 className="font-bold text-lg heading-gradient">MehfilAI</h1>
        </Link>
    </header>
  )
}

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const noSidebarRoutes = ['/login', '/signup', '/verify-email'];
  const isAuthPage = noSidebarRoutes.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  const isChatPage = pathname === '/' || pathname.startsWith('/chat');

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
        <SidebarInset className="flex flex-col">
           <Header />
          <div className={cn("flex-1", isChatPage && "overflow-y-auto")}>
            {children}
          </div>
        </SidebarInset>
    </SidebarProvider>
  );
}
