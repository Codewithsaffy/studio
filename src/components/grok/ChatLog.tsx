import type { Message } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Copy, RefreshCw, Share2, ThumbsDown, ThumbsUp, Bot, User } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

interface ChatLogProps {
  messages: Message[];
  isSending: boolean;
}

export function ChatLog({ messages, isSending }: ChatLogProps) {
  return (
    <div className="space-y-6 px-4 md:px-6 max-w-3xl mx-auto">
      {messages.map((message, index) => (
        <div
          key={`${message.id}-${index}`}
          className={cn(
            'flex gap-3 items-start w-full',
            message.role === 'user' ? 'flex-row-reverse' : ''
          )}
        >
          <div className={cn(
            'flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full',
            message.role === 'user' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted'
          )}>
            {message.role === 'user' ? (
              <User className="h-4 w-4" />
            ) : (
              <Bot className="h-4 w-4" />
            )}
          </div>
          
          <div
            className={cn(
              'flex-1 max-w-[calc(100%-56px)]',
              message.role === 'user' && 'flex justify-end'
            )}
          >
            <div
              className={cn(
                'p-4 rounded-2xl text-sm leading-relaxed',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-md'
                  : 'bg-muted text-foreground rounded-tl-md'
              )}
            >
              {message.content.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
              ))}
            </div>
            
            {message.role === 'assistant' && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Button variant="ghost" size="icon" className="h-7 w-7 p-0 hover:bg-accent">
                  <RefreshCw className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 p-0 hover:bg-accent">
                  <Copy className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 p-0 hover:bg-accent">
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 p-0 hover:bg-accent">
                  <ThumbsDown className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 p-0 hover:bg-accent">
                  <Share2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {isSending && (
        <div className="flex gap-3 items-start w-full">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-muted">
            <Bot className="h-4 w-4" />
          </div>
          <div className="flex-1 max-w-[calc(100%-56px)]">
            <div className="p-4 rounded-2xl rounded-tl-md bg-muted">
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-3 w-3/5" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
