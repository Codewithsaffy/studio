'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode, type CSSProperties } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { LeftSidebar } from '@/components/grok/LeftSidebar';
import { ClientOnly } from './ClientOnly';
import { PanelLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

function Header({ className }: { className?: string }) {
  const isMobile = useIsMobile();
  return (
    <header className={cn("sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6", className)}>
        {isMobile && (
          <div className="flex items-center gap-2">
            <SidebarTrigger>
              <PanelLeft className="h-5 w-5" />
            </SidebarTrigger>
            <Link href="/" className="flex items-center gap-2">
              <h1 className="font-bold text-lg heading-gradient">MehfilAI</h1>
            </Link>
          </div>
        )}
        {!isMobile && <div />}
        <Button variant="outline" asChild>
            <Link href="/vendors">Explore Vendors</Link>
        </Button>
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
          {isChatPage && <Header className="sm:hidden" />}
          <div className={cn("flex-1", isChatPage && "overflow-y-auto")}>
            {children}
          </div>
        </SidebarInset>
    </SidebarProvider>
  );
}
