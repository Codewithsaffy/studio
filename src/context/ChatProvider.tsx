"use client"
import { ChatProvider as Provider } from "./ChatContext";
import { ReactNode } from "react";

export function ChatProvider({ children }: { children: ReactNode }) {
    return <Provider>{children}</Provider>
}
