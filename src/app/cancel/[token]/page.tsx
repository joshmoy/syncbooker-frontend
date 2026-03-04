"use client";

import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import axios, { type AxiosError } from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export default function CancelBookingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleCancel = async () => {
    setStatus("loading");
    try {
      const res = await axios.post(`${API_BASE}/public/cancel/${token}`);
      setMessage(res.data.message || "Your booking has been cancelled.");
      setStatus("success");
    } catch (err) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      setMessage(
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        "This cancellation link is invalid or has already been used."
      );
      setStatus("error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="SyncBooker"
              width={140}
              height={40}
              className="w-full max-w-[180px] h-auto"
            />
          </Link>
        </div>

        <Card>
          <CardContent className="p-8 text-center space-y-6">
            {status === "idle" && (
              <>
                <div className="flex justify-center">
                  <div className="rounded-full bg-destructive/10 p-4">
                    <XCircle className="h-10 w-10 text-destructive" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h1 className="heading-md">Cancel Your Booking</h1>
                  <p className="body-md text-muted-foreground">
                    Are you sure you want to cancel this booking? This action cannot be undone.
                  </p>
                </div>
                <Button variant="destructive" className="w-full" onClick={handleCancel}>
                  Yes, Cancel My Booking
                </Button>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Keep My Booking
                  </Button>
                </Link>
              </>
            )}

            {status === "loading" && (
              <div className="flex flex-col items-center gap-4 py-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="body-md text-muted-foreground">Cancelling your booking...</p>
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
                  <h1 className="heading-md">Booking Cancelled</h1>
                  <p className="body-md text-muted-foreground">{message}</p>
                </div>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </>
            )}

            {status === "error" && (
              <>
                <div className="flex justify-center">
                  <div className="rounded-full bg-destructive/10 p-4">
                    <XCircle className="h-10 w-10 text-destructive" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h1 className="heading-md">Something Went Wrong</h1>
                  <p className="body-md text-muted-foreground">{message}</p>
                </div>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
