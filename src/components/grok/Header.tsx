"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()
  let title = "Agent"

  if (pathname.startsWith("/vendors")) {
    title = "Vendors"
  } else if (pathname.startsWith("/inbox")) {
    title = "Inbox"
  } else if (pathname.startsWith("/bookings")) {
    title = "Bookings"
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 bg-background z-50 lg:hidden">
      <SidebarTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SidebarTrigger>
      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  )
}
