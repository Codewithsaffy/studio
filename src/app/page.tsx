'use client';

import { ChatView } from '@/components/grok/ChatView';
import { ChatProvider } from '@/context/ChatContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Header } from '@/components/grok/Header';
import { type CSSProperties } from 'react';

export default function Home() {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '280px',
          '--sidebar-width-icon': '80px',
        } as CSSProperties
      }
    >
      <ChatProvider>
        <SidebarInset>
          <Header />
          <ChatView />
        </SidebarInset>
      </ChatProvider>
    </SidebarProvider>
  );
}
