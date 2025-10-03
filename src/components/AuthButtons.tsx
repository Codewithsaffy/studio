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

export function AuthButtons() {
  const { data: session, status } = useSession();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  if (status === "loading") {
    return (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        <div className="h-4 w-20 rounded-md bg-muted animate-pulse group-data-[collapsible=icon]:hidden" />
      </div>
    );
  }

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex justify-start items-center gap-3 p-2 h-auto"
          >
            <Avatar className="h-8 w-8">
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
            <div className="flex flex-col items-start min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium leading-none truncate">
                {session.user?.name || "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {session.user?.email}
              </p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
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

  if (isCollapsed) {
    return (
      <Link href="/login" className="w-full">
        <Button
          variant="ghost"
          className="w-full flex justify-center items-center gap-3 p-2 h-auto"
        >
          <UserIcon className="h-5 w-5" />
        </Button>
      </Link>
    );
  }

  return (
    <Link href="/login" className="w-full">
      <Button
        variant="ghost"
        className="w-full flex justify-start items-center gap-3 p-2 h-auto"
      >
        <UserIcon className="h-5 w-5" />
        <span className="font-medium text-sm">Login</span>
      </Button>
    </Link>
  );
}
