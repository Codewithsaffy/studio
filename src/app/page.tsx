'use client';

import { ChatView } from '@/components/grok/ChatView';
import { ChatProvider } from '@/context/ChatContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { LeftSidebar } from '@/components/grok/LeftSidebar';
import { Header } from '@/components/grok/Header';
import { type CSSProperties } from 'react';

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
      <SidebarInset className="overflow-hidden">
        <Header />
        <ChatProvider>
          <ChatView />
        </ChatProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
