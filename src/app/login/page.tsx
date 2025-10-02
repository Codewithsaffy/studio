"use client";

import type React from "react";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 luxury-gradient-bg relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-lg relative z-10">
          <div className="mb-8">
            <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold mb-3 heading-gradient">
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-base">
              Sign in to continue your wedding planning journey
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg text-sm border bg-destructive/10 text-destructive border-destructive/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  required
                  className="pl-12 h-12 text-base border-border/50 focus:border-primary bg-background/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                  className="pl-12 pr-12 h-12 text-base border-border/50 focus:border-primary bg-background/50"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-4 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-start gap-3">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border/50 accent-primary cursor-pointer"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-border/50"></div>
            <span className="px-4 text-sm text-muted-foreground font-medium">
              OR
            </span>
            <div className="flex-1 border-t border-border/50"></div>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full h-12 flex items-center justify-center gap-3 border-border/50 hover:bg-muted hover:border-primary/40 transition-all text-base"
              type="button"
            >
              <FaGoogle className="h-5 w-5" />
              <span className="font-medium">Continue with Google</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="w-full h-12 flex items-center justify-center gap-3 border-border/50 hover:bg-muted hover:border-primary/40 transition-all text-base"
              type="button"
            >
              <FaGithub className="h-5 w-5" />
              <span className="font-medium">Continue with GitHub</span>
            </Button>
          </div>

          <div className="mt-8 text-center text-base">
            <span className="text-muted-foreground">
              Don't have an account?
            </span>{" "}
            <Link
              href="/signup"
              className="text-primary hover:underline font-semibold"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-secondary/10 via-primary/5 to-secondary/5 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center px-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary">
              AI-Powered Wedding Planning
            </span>
          </div>

          <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight text-balance">
            Your Dream Wedding,{" "}
            <span className="heading-gradient">Simplified</span>
          </h2>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
            We use AI to recommend the perfect venues and vendors based on your
            budget, preferences, and availability — saving you time and reducing
            stress.
          </p>
        </div>

        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <img
            src="/elegant-wedding-rings-and-flowers.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
