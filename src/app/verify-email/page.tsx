import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { VerificationUI } from "@/components/verification/VerificationUI";

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
    <div className="flex items-center space-x-2 text-primary">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span>Verifying your email...</span>
    </div>
  </div>
);

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerificationUI />
    </Suspense>
  );
}