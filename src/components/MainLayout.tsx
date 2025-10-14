
'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode, type CSSProperties } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { LeftSidebar } from '@/components/grok/LeftSidebar';
import { ClientOnly } from './ClientOnly';
import { PanelLeft, Plus, Share2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

function Header() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const isChatPage = pathname.startsWith('/chat');

  const desktopChatHeader = (
    <header className="sticky w-full border-b top-0 right-0 z-10 px-4 py-2 flex items-center gap-2 justify-end bg-background">
      <Button variant="ghost" className=" hover:text-foreground">
        <Plus className="mr-2 h-4 w-4" />
        New Chat
      </Button>
      <Button variant="ghost" className=" hover:text-foreground">
        Share
        <Share2 className="ml-2 h-4 w-4" />
      </Button>
    </header>
  );

  const mobileHeader = (
     <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4">
        <SidebarTrigger>
          <PanelLeft className="h-5 w-5" />
        </SidebarTrigger>
        
        {isChatPage && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        )}
    </header>
  );

  if (isMobile) {
    return mobileHeader;
  }
  
  if(isChatPage) {
    return desktopChatHeader;
  }

  return null;
}

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const noSidebarRoutes = ['/login', '/signup', '/verify-email'];
  const isAuthPage = noSidebarRoutes.includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  const isChatPage = pathname.startsWith('/chat');

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '260px',
          '--sidebar-width-icon': '80px',
        } as CSSProperties
      }
    >
      <>
        <ClientOnly>
          <LeftSidebar />
        </ClientOnly>
        <SidebarInset className="flex flex-col h-screen">
           <Header />
          <div className={cn("flex-1", isChatPage && "overflow-y-auto")}>
            {children}
          </div>
        </SidebarInset>
      </>
    </SidebarProvider>
  );
}
