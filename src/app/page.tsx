'use client';

import type { CSSProperties } from 'react';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { LeftSidebar } from '@/components/grok/LeftSidebar';
import { ChatView } from '@/components/grok/ChatView';
import { ChatProvider } from '@/context/ChatContext';
import { AuthButtons } from '@/components/AuthButtons';

export default function Home() {
  return (
    <ChatProvider>
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
          <div className="absolute top-4 left-4 z-20">
            <SidebarTrigger />
          </div>
          <div className="absolute top-4 right-4 z-20">
            <AuthButtons />
          </div>
          <ChatView />
        </SidebarInset>
      </SidebarProvider>
    </ChatProvider>
  );
}
