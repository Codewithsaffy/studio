import type { Message } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Copy, RefreshCw, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

interface ChatLogProps {
  messages: Message[];
  isSending: boolean;
}

export function ChatLog({ messages, isSending }: ChatLogProps) {
  return (
    <div className="space-y-8 px-4 md:px-8 max-w-4xl mx-auto">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            'flex gap-4 text-base',
            message.role === 'user' ? 'justify-end' : ''
          )}
        >
          {message.role === 'assistant' && (
            <div className="flex-shrink-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback>G</AvatarFallback>
              </Avatar>
            </div>
          )}
          <div
            className={cn(
              'flex-1 max-w-xl',
              message.role === 'user' && 'text-right'
            )}
          >
            <p className="font-medium mb-2">
              {message.role === 'user' ? 'You' : 'Grok'}
            </p>
            <div
              className={cn(
                'space-y-4 text-foreground/90 p-4 rounded-lg',
                message.role === 'assistant'
                  ? 'bg-card'
                  : 'bg-primary text-primary-foreground'
              )}
            >
              {message.content.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            {message.role === 'assistant' && (
              <div className="flex items-center gap-2 mt-3 text-muted-foreground">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ThumbsDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          {message.role === 'user' && (
            <div className="flex-shrink-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      ))}
      {isSending && (
        <div className="flex gap-4 text-base">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback>G</AvatarFallback>
          </Avatar>
          <div className="flex-1 max-w-xl">
            <p className="font-medium mb-2">Grok</p>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
