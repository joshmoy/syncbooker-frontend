import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              <span className="heading-sm">SyncBooker</span>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="heading-xl mb-6">
            Simple Scheduling
            <br />
            Made Easy
          </h1>
          <p className="body-lg mx-auto mb-10 max-w-2xl text-muted-foreground">
            Share your availability, let others book time with you. No back and
            forth emails. Just simple, elegant scheduling.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8">
                Start for Free
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="h-12 px-8">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-foreground text-background">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="heading-sm">Easy Availability</h3>
              <p className="body-sm text-muted-foreground">
                Set your available hours once and let others find time that
                works for both of you.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-foreground text-background">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="heading-sm">Time Zone Smart</h3>
              <p className="body-sm text-muted-foreground">
                Automatically handles time zones so you never have to do the
                math.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-foreground text-background">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="heading-sm">Multiple Events</h3>
              <p className="body-sm text-muted-foreground">
                Create different event types with custom durations and
                descriptions.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-foreground text-background">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="heading-sm">Instant Booking</h3>
              <p className="body-sm text-muted-foreground">
                Share your link and get booked instantly. Confirmations sent
                automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="heading-lg mb-6">Ready to simplify your scheduling?</h2>
          <p className="body-lg mb-10 text-muted-foreground">
            Join thousands of professionals who save time with SyncBooker.
          </p>
          <Link href="/signup">
            <Button size="lg" className="h-12 px-8">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="label-md">SyncBooker</span>
            </div>
            <p className="body-sm text-muted-foreground">
              © 2024 SyncBooker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}