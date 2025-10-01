'use client';

import type { CSSProperties } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { LeftSidebar } from '@/components/grok/LeftSidebar';
import { ChatView } from '@/components/grok/ChatView';

export default function Home() {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '260px',
          '--sidebar-width-icon': '80px',
        } as CSSProperties
      }
    >
      <LeftSidebar />
      <SidebarInset>
        <div className="absolute top-4 left-4">
          <SidebarTrigger />
        </div>
        <ChatView />
      </SidebarInset>
    </SidebarProvider>
  );
}
