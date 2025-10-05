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
  PanelLeft,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChatContext } from "@/context/ChatContext";
import { isToday, isYesterday } from "date-fns";
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
        } else {
          groups["Previous 30 Days"].push(convo);
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
            isCollapsed ? "justify-center" : "justify-end"
          )}
        >
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
      <SidebarContent className="flex flex-col">
        {/* Main navigation - fixed at top */}
        <div className="flex-shrink-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/" className="w-full">
                <SidebarMenuButton tooltip="Agent" isActive={pathname === "/"}>
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
          </SidebarMenu>

          {/* Vendors Section - fixed */}
          <Collapsible
            open={isVendorsOpen}
            onOpenChange={setIsVendorsOpen}
            className="mt-4"
          >
            <div
              className={cn(
                "group-data-[collapsible=icon]:hidden px-2 pb-2",
                isCollapsed && "hidden"
              )}
            >
              <div
                className={cn(
                  "w-full justify-start px-2 flex items-center rounded-md",
                  pathname.startsWith("/vendors") &&
                    "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Link href="/vendors" className="flex-1 flex items-center p-2">
                  <Building2 className="mr-2 h-4 w-4" />
                  <span>Vendors</span>
                </Link>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                  >
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
            <SidebarMenu
              className={cn(
                "hidden",
                !isCollapsed && "hidden",
                isCollapsed && "flex"
              )}
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Vendors"
                  asChild
                  isActive={pathname.startsWith("/vendors")}
                >
                  <CollapsibleTrigger>
                    <Link href="/vendors">
                      <Building2 />
                    </Link>
                  </CollapsibleTrigger>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <CollapsibleContent>
              <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                <SidebarMenu>
                  {vendorLinks.map((link) => (
                    <SidebarMenuItem key={link.href}>
                      <Link href={link.href} className="w-full">
                        <SidebarMenuButton isActive={pathname === link.href}>
                          <link.icon className="mr-2 h-4 w-4" />
                          {link.label}
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* History Section - scrollable, takes remaining space */}
        <Collapsible
          open={isHistoryOpen}
          onOpenChange={setIsHistoryOpen}
          className="flex flex-col flex-1 min-h-0 mt-4"
        >
          <div className="flex-shrink-0 group-data-[collapsible=icon]:hidden px-2 pb-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start px-2">
                <History className="mr-2 h-4 w-4" />
                <span>History</span>
                <ChevronsUpDown className="ml-auto h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <SidebarMenu className="flex-shrink-0 hidden group-data-[collapsible=icon]:flex">
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="History" asChild>
                <CollapsibleTrigger>
                  <History />
                </CollapsibleTrigger>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <CollapsibleContent className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="px-2">
                {Object.entries(groupedConversations).map(
                  ([groupName, convos]) =>
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
              </div>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col gap-2 p-2">
          <div className="group-data-[collapsible=icon]:hidden">
            <ThemeToggle />
          </div>
          <AuthButtons />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
