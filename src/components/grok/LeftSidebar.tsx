'use client';

import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ChevronsUpDown,
  Folder,
  History,
  Image as ImageIcon,
  MessageSquare,
  Mic,
  Search,
} from 'lucide-react';

export function LeftSidebar() {
  const { state } = useSidebar();
  const [isMac, setIsMac] = React.useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(true);

  React.useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {isCollapsed ? (
          <SidebarMenuButton tooltip="Search" size="icon" className="w-full">
            <Search />
          </SidebarMenuButton>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-9 bg-background focus-visible:ring-sidebar-ring" />
            <kbd className="absolute top-1/2 -translate-y-1/2 right-3 hidden items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground group-data-[collapsible=icon]:hidden md:flex">
              <span className="text-xs">{isMac ? '⌘' : 'Ctrl+'}</span>K
            </kbd>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Ask" isActive>
              <MessageSquare />
              <span className="group-data-[collapsible=icon]:hidden">Ask</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Voice">
              <Mic />
              <span className="group-data-[collapsible=icon]:hidden">Voice</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Imagine">
              <ImageIcon />
              <span className="group-data-[collapsible=icon]:hidden">Imagine</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Projects">
              <Folder />
              <span className="group-data-[collapsible=icon]:hidden">Projects</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <Collapsible open={isHistoryOpen} onOpenChange={setIsHistoryOpen} className="mt-4">
           <div className="group-data-[collapsible=icon]:hidden px-2 pb-2">
            <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-2">
                    <History className="mr-2 h-4 w-4" />
                    <span>History</span>
                    <ChevronsUpDown className="ml-auto h-4 w-4" />
                </Button>
            </CollapsibleTrigger>
          </div>
          <div className="group-data-[collapsible=icon]:flex hidden p-2 justify-center">
             <SidebarMenuButton tooltip="History" size="icon" className="w-auto" asChild>
                <CollapsibleTrigger>
                    <History />
                </CollapsibleTrigger>
            </SidebarMenuButton>
          </div>
          <CollapsibleContent>
            <SidebarGroup className="group-data-[collapsible=icon]:hidden">
              <SidebarGroupLabel >Today</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>What is Next.js?</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Dark mode UI design tips</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup className="group-data-[collapsible=icon]:hidden">
              <SidebarGroupLabel>Yesterday</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>Best fonts for web</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </CollapsibleContent>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter>
         <div className="flex items-center gap-3 p-2">
            <Avatar className="h-8 w-8">
                <AvatarFallback>M</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">
                User
            </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
