"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useSidebar } from "./ui/sidebar";
import { cn } from "@/lib/utils";

export function AuthButtons() {
  const { data: session, status } = useSession();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  if (status === "loading") {
    return (
      <div className="flex items-center gap-3 px-2 py-2">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        {!isCollapsed && (
          <div className="h-4 w-20 rounded-md bg-muted animate-pulse" />
        )}
      </div>
    );
  }

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 px-2 py-2 h-auto hover:bg-sidebar-accent",
              isCollapsed && "justify-center px-2"
            )}
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage
                src={session.user?.image || ""}
                alt={session.user?.name || "User"}
              />
              <AvatarFallback>
                {session.user?.name?.charAt(0) ||
                  session.user?.email?.charAt(0) ||
                  "U"}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col items-start min-w-0 flex-1 text-left">
                <p className="text-sm font-medium leading-none truncate w-full">
                  {session.user?.name || "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground truncate w-full mt-1">
                  {session.user?.email}
                </p>
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          align={isCollapsed ? "center" : "end"}
          side={isCollapsed ? "right" : "top"}
          sideOffset={isCollapsed ? 8 : 4}
        >
          <DropdownMenuItem
            onClick={() => signOut()}
            className="cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link href="/login" className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 px-2 py-2 h-auto hover:bg-sidebar-accent",
          isCollapsed && "justify-center px-2"
        )}
      >
        <UserIcon className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && <span className="font-medium text-sm">Login</span>}
      </Button>
    </Link>
  );
}
