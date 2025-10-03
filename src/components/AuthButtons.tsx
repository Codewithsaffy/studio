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
import { LogOut, Github, Mail } from "lucide-react";
import Link from "next/link";

export function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />;
  }

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full mx-10"
          >
            <Avatar className="h-10 w-10">
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
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user?.email}
              </p>
            </div>
          </div>
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

  // When not authenticated, show login button that goes to login page
  return (
    <Link href="/login" className="mx-10 flex items-center gap-2">
      <Mail className="h-4 w-4" />
      Login
    </Link>
  );
}
