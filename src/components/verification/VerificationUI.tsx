"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Mail, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VerificationUI() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link. No token provided.");
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(
            data.message || "Your email has been successfully verified."
          );
        } else {
          setStatus("error");
          setMessage(
            data.message || "Failed to verify email. The link may be expired."
          );
        }
      } catch {
        setStatus("error");
        setMessage(
          "Something went wrong. Please check your connection and try again."
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-background/90 backdrop-blur">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {status === "loading" && (
                <div className="p-3 rounded-full bg-blue-500/10">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              )}
              {status === "success" && (
                <div className="p-3 rounded-full bg-green-500/10">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              )}
              {status === "error" && (
                <div className="p-3 rounded-full bg-red-500/10">
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {status === "loading" && "Verifying Your Email..."}
              {status === "success" && "Email Verified!"}
              {status === "error" && "Verification Failed"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">{message || "Please wait..."}</p>

            {/* Action Buttons */}
            {status === "success" && (
              <Link href="/login" className="block">
                <Button className="w-full">
                  Sign In Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}

            {status === "error" && (
              <div className="space-y-3">
                <Link href="/signup" className="block">
                  <Button variant="outline" className="w-full">
                    Try Again <Mail className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}