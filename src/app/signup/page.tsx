"use client";

import type React from "react";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error messages when user starts typing
    if (message.type === "error") {
      setMessage({ type: "", content: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", content: "Passwords don't match!" });
      return;
    }

    if (!acceptTerms) {
      setMessage({
        type: "error",
        content: "Please accept the terms and conditions",
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", content: "" });

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccess(true);
        setMessage({ type: "success", content: data.message });
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setAcceptTerms(false);
      } else {
        setMessage({ type: "error", content: data.message });
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage({
        type: "error",
        content: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center luxury-gradient-bg p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <Card className="shadow-2xl border-primary/20 bg-card/95 backdrop-blur-xl">
            <CardHeader className="text-center space-y-3 pb-6">
              <div className="flex justify-start">
                <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                  Back to Home
                </Link>
              </div>
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold text-balance">
                Check Your Email
              </CardTitle>
              <CardDescription className="text-base">
                We've sent a verification link to your email address
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {message.content}
              </p>

              <div className="space-y-3 pt-2">
                <Button
                  onClick={() => setShowSuccess(false)}
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                >
                  Create Another Account
                </Button>
                <Link href="/login" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-11 border-primary/20 hover:bg-primary/5 hover:border-primary/40 bg-transparent"
                  >
                    Already verified? Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
              Create Account
            </h1>
            <p className="text-muted-foreground text-base">
              Start planning your dream wedding today
            </p>
          </div>

          {/* Alert Message */}
          {message.content && (
            <div
              className={`mb-6 p-4 rounded-lg text-sm border ${
                message.type === "error"
                  ? "bg-destructive/10 text-destructive border-destructive/20"
                  : "bg-primary/10 text-primary border-primary/20"
              }`}
            >
              {message.content}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="pl-12 h-12 text-base border-border/50 focus:border-primary bg-background/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="pl-12 pr-12 h-12 text-base border-border/50 focus:border-primary bg-background/50"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-4 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                id="accept-terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border/50 accent-primary cursor-pointer"
              />
              <Label
                htmlFor="accept-terms"
                className="text-sm leading-relaxed cursor-pointer"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-primary hover:underline font-medium"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-primary hover:underline font-medium"
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
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

          </div>

          <div className="mt-8 text-center text-base">
            <span className="text-muted-foreground">
              Already have an account?
            </span>{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-semibold"
            >
              Sign in
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

        {/* Decorative wedding image */}
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

export default SignupPage;
