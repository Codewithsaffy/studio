'use client';

import { useState, useEffect } from "react";
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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Building,
  Bus,
  Camera,
  Car,
  Inbox,
  MessageSquare,
  Utensils,
  Book,
  Menu,
  Plus,
  MessageCircle,
  FolderKanban,
  Grid3x3,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { AuthButtons } from "@/components/AuthButtons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function LeftSidebar() {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVendorsOpen, setIsVendorsOpen] = useState(false);

  interface Conversation {
    sessionId: string;
    title: string;
    updatedAt: Date;
    messageCount: number;
    preview: string;
    metadata?: {
      guestCount?: number;
      budget?: number;
      weddingDate?: string;
      location?: string;
    };
  }

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

  useEffect(() => {
    async function loadConversations() {
      try {
        const response = await fetch('/api/conversation');
        const { conversations } = await response.json();
        setConversations(conversations);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
  }, []);

  const navItems = [
    { href: "/", icon: MessageCircle, label: "Chats" },
    { href: "/bookings", icon: FolderKanban, label: "Bookings" },
  ];

  const vendorLinks = [
    { href: "/vendors/halls", icon: Building, label: "Halls" },
    { href: "/vendors/catering", icon: Utensils, label: "Catering" },
    { href: "/vendors/cars", icon: Car, label: "Cars" },
    { href: "/vendors/buses", icon: Bus, label: "Buses" },
    { href: "/vendors/photography", icon: Camera, label: "Photographers" },
  ];

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-border/40 bg-background">
      <SidebarHeader className="border-b border-border/40 px-4 py-3">
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            {!isCollapsed && (
              <>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <Menu className="h-4 w-4" />
                </Button>
                <Link href="/" className="flex items-center gap-2">
                  <h1 className="font-semibold text-base">MehfilAI</h1>
                </Link>
              </>
            )}
          </div>
          {!isMobile && (
            <SidebarTrigger className="h-8 w-8" />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col px-2 py-3">
        {/* New Chat Button */}
        <div className="px-2 mb-4">
          <Link href="/">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 bg-orange-500/10 border-orange-500/20 text-orange-500 hover:bg-orange-500/20 hover:text-orange-600 hover:border-orange-500/30"
            >
              <Plus className="h-4 w-4" />
              {!isCollapsed && <span>New chat</span>}
            </Button>
          </Link>
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="mb-4">
          <SidebarMenu className="space-y-1">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} className="w-full">
                  <SidebarMenuButton
                    isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
                    className={cn(
                      "h-9 px-3 w-full justify-start gap-3 rounded-md transition-colors",
                      pathname === item.href || pathname.startsWith(item.href + '/') 
                        ? "bg-accent text-accent-foreground font-medium" 
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                    tooltip={item.label}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="text-sm group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
            
            {/* Vendors Collapsible */}
            <SidebarMenuItem>
              <Collapsible open={isVendorsOpen} onOpenChange={setIsVendorsOpen}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={cn(
                      "h-9 px-3 w-full justify-start gap-3 rounded-md transition-colors",
                      pathname.startsWith("/vendors")
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                    tooltip="Vendors"
                  >
                    <Building className="h-4 w-4 shrink-0" />
                    <span className="text-sm flex-1 text-left group-data-[collapsible=icon]:hidden">
                      Vendors
                    </span>
                    <ChevronDown 
                      className={cn(
                        "h-3 w-3 shrink-0 transition-transform group-data-[collapsible=icon]:hidden",
                        isVendorsOpen && "rotate-180"
                      )} 
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroup className="p-0 mt-1 group-data-[collapsible=icon]:hidden">
                    <SidebarMenu className="space-y-0.5">
                      {vendorLinks.map((link) => (
                        <SidebarMenuItem key={link.href}>
                          <Link href={link.href} className="w-full">
                            <SidebarMenuButton
                              isActive={pathname === link.href}
                              className={cn(
                                "h-9 px-3 pl-9 w-full justify-start gap-3 rounded-md transition-colors",
                                pathname === link.href
                                  ? "bg-accent text-accent-foreground font-medium"
                                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                              )}
                            >
                              <link.icon className="h-4 w-4 shrink-0" />
                              <span className="text-sm">{link.label}</span>
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
        </SidebarGroup>

        {/* Recents Section */}
        <div className="flex-1 min-h-0">
          {!isCollapsed && (
            <div className="px-2 mb-2">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Recents
              </h2>
            </div>
          )}
          
          <ScrollArea className="h-full">
            <SidebarMenu className="space-y-0.5">
              {loading ? (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  {!isCollapsed && "Loading..."}
                </div>
              ) : conversations.length === 0 ? (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  {!isCollapsed && "No conversations yet"}
                </div>
              ) : (
                conversations.map((conv) => (
                  <SidebarMenuItem key={conv.sessionId}>
                    <Link href={`/chat/${conv.sessionId}`} className="w-full group">
                      <SidebarMenuButton
                        isActive={pathname === `/chat/${conv.sessionId}`}
                        className={cn(
                          "h-9 px-3 w-full justify-between rounded-md transition-colors",
                          pathname === `/chat/${conv.sessionId}`
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-foreground hover:bg-accent/50"
                        )}
                        tooltip={conv.title}
                      >
                        <span className="truncate text-sm flex-1 text-left group-data-[collapsible=icon]:hidden">
                          {conv.title}
                        </span>
                        <MoreHorizontal className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity group-data-[collapsible=icon]:hidden" />
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </ScrollArea>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-3">
        <AuthButtons />
      </SidebarFooter>
    </Sidebar>
  );
}