'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { ChatView } from '@/components/grok/ChatView';
import { ChatProvider } from '@/context/ChatContext';

export default function Home() {
  return (
    <ChatProvider>
      <div className="absolute top-4 left-4 z-20">
        <SidebarTrigger />
      </div>
      <ChatView />
    </ChatProvider>
  );
}
