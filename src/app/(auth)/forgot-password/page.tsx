"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, ArrowLeft, MailCheck } from "lucide-react";
import { useForgotPassword } from "@/hooks/use-auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    forgotPasswordMutation.mutate({ email });
  };

  if (forgotPasswordMutation.isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MailCheck className="h-6 w-6" />
            </div>
            <h1 className="heading-lg mt-6">Check your email</h1>
            <p className="body-md mt-2 text-muted-foreground">
              We&apos;ve sent a password reset link to <strong>{email}</strong>.
            </p>
            <div className="mt-8">
              <Link href="/login">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            <span className="heading-md">SyncBooker</span>
          </Link>
          <h1 className="heading-lg mt-6">Forgot password?</h1>
          <p className="body-md mt-2 text-muted-foreground">
            No worries, we&apos;ll send you reset instructions.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={forgotPasswordMutation.isPending}>
              {forgotPasswordMutation.isPending ? "Sending link..." : "Reset password"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 body-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
