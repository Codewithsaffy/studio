"use client";

import React, { useContext } from "react";
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
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Building,
  Bus,
  Camera,
  Car,
  ChevronsUpDown,
  History,
  Inbox,
  MessageSquare,
  Search,
  Utensils,
  Book,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChatContext } from "@/context/ChatContext";
import { isToday, isYesterday, format } from "date-fns";
import { Conversation } from "@/types";

export function LeftSidebar() {
  const { state } = useSidebar();
  const [isMac, setIsMac] = React.useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(true);
  const [isVendorsOpen, setIsVendorsOpen] = React.useState(true);

  const { conversations, activeConversation, loadConversation } =
    useContext(ChatContext);

  React.useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  const isCollapsed = state === "collapsed";

  const groupConversationsByDate = (convos: Conversation[]) => {
    const groups: { [key: string]: Conversation[] } = {
      Today: [],
      Yesterday: [],
      "Previous 7 Days": [],
      "Previous 30 Days": [],
    };

    convos.forEach((convo) => {
      const date = new Date(convo.createdAt);
      if (isToday(date)) {
        groups.Today.push(convo);
      } else if (isYesterday(date)) {
        groups.Yesterday.push(convo);
      } else {
        // For simplicity, we can group by month or just older.
        // This example is simplified.
        const diffDays =
          (new Date().getTime() - date.getTime()) / (1000 * 3600 * 24);
        if (diffDays <= 7) {
          groups["Previous 7 Days"].push(convo);
        } else {
          groups["Previous 30 Days"].push(convo);
        }
      }
    });

    return groups;
  };

  const groupedConversations = groupConversationsByDate(conversations);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {isCollapsed ? (
          <SidebarMenuButton tooltip="Search" className="w-full">
            <Search />
          </SidebarMenuButton>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-9 bg-background focus-visible:ring-sidebar-ring"
            />
            <kbd className="absolute top-1/2 -translate-y-1/2 right-3 hidden items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground group-data-[collapsible=icon]:hidden md:flex">
              <span className="text-xs">{isMac ? "⌘" : "Ctrl+"}</span>K
            </kbd>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className="flex flex-col overflow-hidden">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Agent" isActive>
              <MessageSquare />
              <span className="group-data-[collapsible=icon]:hidden">
                Agent
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Inbox">
              <Inbox />
              <span className="group-data-[collapsible=icon]:hidden">
                Inbox
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Bookings">
              <Book />
              <span className="group-data-[collapsible=icon]:hidden">
                Bookings
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <Collapsible
          open={isVendorsOpen}
          onOpenChange={setIsVendorsOpen}
          className="mt-4 flex flex-col min-h-0"
        >
          <div className="group-data-[collapsible=icon]:hidden px-2 pb-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start px-2">
                <Building2 className="mr-2 h-4 w-4" />
                <span>Vendors</span>
                <ChevronsUpDown className="ml-auto h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Vendors" asChild>
                <CollapsibleTrigger>
                  <Building2 />
                </CollapsibleTrigger>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <CollapsibleContent asChild>
            <ScrollArea>
              <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Building className="mr-2 h-4 w-4" />
                      Halls
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Utensils className="mr-2 h-4 w-4" />
                      Catering
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Car className="mr-2 h-4 w-4" />
                      Cars
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Bus className="mr-2 h-4 w-4" />
                      Buses
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Camera className="mr-2 h-4 w-4" />
                      Photographers
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={isHistoryOpen}
          onOpenChange={setIsHistoryOpen}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="group-data-[collapsible=icon]:hidden px-2 pb-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start px-2">
                <History className="mr-2 h-4 w-4" />
                <span>History</span>
                <ChevronsUpDown className="ml-auto h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="History" asChild>
                <CollapsibleTrigger>
                  <History />
                </CollapsibleTrigger>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <CollapsibleContent asChild className="flex-1">
            <ScrollArea>
              {Object.entries(groupedConversations).map(([groupName, convos]) =>
                convos.length > 0 ? (
                  <SidebarGroup
                    key={groupName}
                    className="group-data-[collapsible=icon]:hidden"
                  >
                    <SidebarGroupLabel>{groupName}</SidebarGroupLabel>
                    <SidebarMenu>
                      {convos.map((convo) => (
                        <SidebarMenuItem key={convo.id}>
                          <SidebarMenuButton
                            isActive={activeConversation?.id === convo.id}
                            onClick={() => loadConversation(convo.id)}
                          >
                            {convo.title}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroup>
                ) : null
              )}
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between gap-3 p-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium group-data-[collapsible=icon]:hidden">
              User
            </span>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <ThemeToggle />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
