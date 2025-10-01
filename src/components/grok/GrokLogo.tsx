import { cn } from "@/lib/utils";

export function GrokLogo({ className }: { className?: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-foreground", className)}
    >
      <path
        d="M12 2.5L13.84 8.16L19.5 10L13.84 11.84L12 17.5L10.16 11.84L4.5 10L10.16 8.16L12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 18.5L5.42 16.34L7.5 15.5L5.42 14.66L4.5 12.5L3.58 14.66L1.5 15.5L3.58 16.34L4.5 18.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 18.5L18.58 16.34L16.5 15.5L18.58 14.66L19.5 12.5L20.42 14.66L22.5 15.5L20.42 16.34L19.5 18.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
