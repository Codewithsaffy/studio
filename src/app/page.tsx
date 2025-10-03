'use client';

import { ChatView } from '@/components/grok/ChatView';
import { ChatProvider } from '@/context/ChatContext';

export default function Home() {
  return (
    <ChatProvider>
      <ChatView />
    </ChatProvider>
  );
}
