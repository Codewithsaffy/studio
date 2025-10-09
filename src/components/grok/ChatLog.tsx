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
      {messages.map((message, index) => (
        <div
          key={`${message.content}-${index}`}
          className={cn(
            'flex gap-4 text-base',
            message.role === 'user' ? 'justify-end' : ''
          )}
        >
         
          <div
            className={cn(
              'flex-1 max-w-xl',
              message.role === 'user' && 'text-right'
            )}
          >
            
            <div
              className={cn(
                'space-y-4 text-foreground/90 rounded-lg',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground inline-block p-4'
                  : 'py-4 pr-4'
              )}
            >
              {message.content.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            {message.role === 'assistant' && (
              <div className="flex items-center text-muted-foreground">
                <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2">
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
