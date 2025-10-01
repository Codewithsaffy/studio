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
  ChevronsLeft,
  ChevronsUpDown,
  Folder,
  Image as ImageIcon,
  MessageSquare,
  Mic,
  Search,
} from 'lucide-react';

export function LeftSidebar() {
  const { toggleSidebar, state } = useSidebar();
  const [isMac, setIsMac] = React.useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(true);

  React.useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search" className="pl-9 bg-background focus-visible:ring-sidebar-ring" />
          <kbd className="absolute top-1/2 -translate-y-1/2 right-3 hidden items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground group-data-[collapsible=icon]:hidden md:flex">
            <span className="text-xs">{isMac ? '⌘' : 'Ctrl+'}</span>K
          </kbd>
        </div>
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

        <Collapsible open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <div className="group-data-[collapsible=icon]:hidden">
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-2 pt-4">
                <SidebarGroupLabel>History</SidebarGroupLabel>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ChevronsUpDown className="h-4 w-4" />
                </Button>
              </div>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <SidebarGroup>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Today</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>What is Next.js?</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Dark mode UI design tips</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Yesterday</SidebarGroupLabel>
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
        <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarFallback>M</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">
                    User
                </span>
            </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="group-data-[collapsible=icon]:hidden"
          >
            <ChevronsLeft
              className={`h-5 w-5 transition-transform duration-300 ${
                state === 'collapsed' ? 'rotate-180' : ''
              }`}
            />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
