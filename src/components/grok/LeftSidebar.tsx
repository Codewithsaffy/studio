
"use client";

import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
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
  PanelLeft,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChatContext } from "@/context/ChatContext";
import { isToday, isYesterday, formatDistanceToNow } from "date-fns";
import type { Conversation } from "@/types";
import { AuthButtons } from "@/components/AuthButtons";
import { cn } from "@/lib/utils";

export function LeftSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const [isMac, setIsMac] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [isVendorsOpen, setIsVendorsOpen] = useState(false);

  const { conversations, activeConversation, loadConversation } =
    useContext(ChatContext);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  const isCollapsed = state === "collapsed";

  const groupConversationsByDate = (convos: Conversation[]) => {
    const groups: { [key: string]: Conversation[] } = {
      Today: [],
      Yesterday: [],
      "Previous 7 Days": [],
      "Previous 30 Days": [],
      Older: [],
    };

    convos.forEach((convo) => {
      const date = new Date(convo.createdAt);
      if (isToday(date)) {
        groups.Today.push(convo);
      } else if (isYesterday(date)) {
        groups.Yesterday.push(convo);
      } else {
        const diffDays =
          (new Date().getTime() - date.getTime()) / (1000 * 3600 * 24);
        if (diffDays <= 7) {
          groups["Previous 7 Days"].push(convo);
        } else if (diffDays <= 30) {
          groups["Previous 30 Days"].push(convo);
        } else {
          groups.Older.push(convo);
        }
      }
    });

    return groups;
  };

  const groupedConversations = groupConversationsByDate(conversations);

  const vendorLinks = [
    { href: "/vendors/halls", icon: Building, label: "Halls" },
    { href: "/vendors/catering", icon: Utensils, label: "Catering" },
    { href: "/vendors/cars", icon: Car, label: "Cars" },
    { href: "/vendors/buses", icon: Bus, label: "Buses" },
    { href: "/vendors/photography", icon: Camera, label: "Photographers" },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarRail />
      <SidebarHeader>
        <div
          className={cn(
            "flex items-center p-2",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          <h1
            className={cn(
              "font-bold text-lg heading-gradient",
              isCollapsed && "hidden"
            )}
          >
            MehfilAI
          </h1>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <PanelLeft
              className={cn(
                "h-5 w-5 transition-transform",
                isCollapsed && "rotate-180"
              )}
            />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col overflow-y-auto overflow-x-hidden">
        <div className="flex-shrink-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/" className="w-full">
                <SidebarMenuButton
                  tooltip="Agent"
                  isActive={
                    pathname === "/" ||
                    (pathname.startsWith("/chat") &&
                      activeConversation === null)
                  }
                >
                  <MessageSquare />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Agent
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/inbox" className="w-full">
                <SidebarMenuButton
                  tooltip="Inbox"
                  isActive={pathname.startsWith("/inbox")}
                >
                  <Inbox />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Inbox
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/bookings" className="w-full">
                <SidebarMenuButton
                  tooltip="Bookings"
                  isActive={pathname.startsWith("/bookings")}
                >
                  <Book />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Bookings
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Collapsible open={isVendorsOpen} onOpenChange={setIsVendorsOpen}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className="w-full"
                    isActive={pathname.startsWith("/vendors")}
                  >
                    <Link href="/vendors" className="flex items-center flex-1">
                      <Building2 className="mr-3" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        Vendors
                      </span>
                    </Link>
                    <ChevronsUpDown className="h-3.5 w-3.5 ml-auto group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroup className="p-0 mt-1 group-data-[collapsible=icon]:hidden">
                    <SidebarMenu>
                      {vendorLinks.map((link) => (
                        <SidebarMenuItem key={link.href}>
                          <Link href={link.href} className="w-full">
                            <SidebarMenuButton
                              isActive={pathname === link.href}
                              className="h-9"
                            >
                              <link.icon className="mr-3 h-4 w-4" />
                              {link.label}
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroup>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <SidebarMenuItem>
              <Collapsible open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="w-full">
                    <History />
                    <span className="group-data-[collapsible=icon]:hidden flex-1 text-left">
                      History
                    </span>
                    <ChevronsUpDown className="h-3.5 w-3.5 ml-auto group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroup className="p-0 mt-1 group-data-[collapsible=icon]:hidden">
                    <SidebarMenu>
                      {Object.entries(groupedConversations).map(
                        ([groupName, convos]) =>
                          convos.length > 0 ? (
                            <div key={groupName} className="px-2">
                              <SidebarGroupLabel>
                                {groupName}
                              </SidebarGroupLabel>
                              <SidebarMenu>
                                {convos.map((convo) => (
                                  <SidebarMenuItem key={convo.id}>
                                    <Link
                                      href={`/chat/${convo.id}`}
                                      className="w-full"
                                    >
                                      <SidebarMenuButton
                                        isActive={
                                          pathname === `/chat/${convo.id}`
                                        }
                                        className="h-9"
                                      >
                                        <span className="truncate">
                                          {convo.title}
                                        </span>
                                      </SidebarMenuButton>
                                    </Link>
                                  </SidebarMenuItem>
                                ))}
                              </SidebarMenu>
                            </div>
                          ) : null
                      )}
                    </SidebarMenu>
                  </SidebarGroup>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>
          </ScrollArea>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col gap-2 p-2">
          <AuthButtons />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
