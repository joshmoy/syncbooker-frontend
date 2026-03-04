"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "no-token">("loading");
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => {
    if (!token) {
      setStatus("no-token");
      return;
    }
    axios
      .get(`${API_BASE}/auth/verify-email?token=${token}`)
      .then((res) => {
        setMessage(res.data.message);
        setStatus("success");
      })
      .catch((err) => {
        setMessage(
          err.response?.data?.error ||
          err.response?.data?.message ||
          "This verification link is invalid or has expired."
        );
        setStatus("error");
      });
  }, [token]);

  const handleResend = async () => {
    if (!resendEmail) return;
    setResendStatus("loading");
    await axios
      .post(`${API_BASE}/auth/resend-verification`, { email: resendEmail })
      .catch(() => {});
    setResendStatus("done");
  };

  return (
    <Card>
      <CardContent className="p-8 text-center space-y-6">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="body-md text-muted-foreground">Verifying your email...</p>
          </div>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center">
              <div className="rounded-full bg-success/10 p-4">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="heading-md">Email Verified!</h1>
              <p className="body-md text-muted-foreground">{message}</p>
            </div>
            <Link href="/dashboard">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </>
        )}

        {(status === "error" || status === "no-token") && (
          <>
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-4">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="heading-md">Verification Failed</h1>
              <p className="body-md text-muted-foreground">
                {status === "no-token"
                  ? "No verification token provided."
                  : message}
              </p>
            </div>

            {resendStatus === "done" ? (
              <p className="body-sm text-muted-foreground">
                If that email is registered and unverified, a new link has been sent.
              </p>
            ) : (
              <div className="space-y-3 text-left">
                <p className="body-sm text-muted-foreground text-center">
                  Request a new verification link:
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                  <Button
                    onClick={handleResend}
                    disabled={!resendEmail || resendStatus === "loading"}
                    size="sm"
                  >
                    {resendStatus === "loading" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            <Link href="/login">
              <Button variant="outline" className="w-full">Back to Login</Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Link href="/">
            <Image src="/logo.svg" alt="SyncBooker" width={140} height={40} className="h-auto" />
          </Link>
        </div>
        <Suspense
          fallback={
            <Card>
              <CardContent className="p-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
