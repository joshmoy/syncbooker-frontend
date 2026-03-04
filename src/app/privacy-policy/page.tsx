import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Privacy Policy" };

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://syncbooker.com";
const appHost = new URL(appUrl).hostname;

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="SyncBooker"
                width={28}
                height={28}
                className="w-full max-w-[180px] h-auto"
              />
            </Link>
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

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <div>
            <h1 className="heading-xl mb-3">Privacy Policy</h1>
            <p className="body-sm text-muted-foreground">Last updated: March 4, 2026</p>
          </div>

          <p className="body-md text-muted-foreground">
            SyncBooker (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to
            protecting your privacy. This Privacy Policy explains how we collect, use, and share
            information about you when you use our scheduling service at {appHost} (the
            &quot;Service&quot;).
          </p>

          <Section title="1. Information We Collect">
            <Subsection title="Information you provide">
              <ul className="list-disc pl-6 space-y-2 body-md text-muted-foreground">
                <li>
                  <strong className="text-foreground">Account information:</strong> When you
                  register, we collect your name, email address, and password.
                </li>
                <li>
                  <strong className="text-foreground">Profile information:</strong> Username,
                  profile picture, and banner image you choose to upload.
                </li>
                <li>
                  <strong className="text-foreground">Event types:</strong> Titles, descriptions,
                  durations, and availability windows you configure.
                </li>
                <li>
                  <strong className="text-foreground">Booking information:</strong> When someone
                  books time with you, we collect the invitee&apos;s name, email address, and any
                  optional notes they provide.
                </li>
                <li>
                  <strong className="text-foreground">Calendar integration:</strong> If you connect
                  Google Calendar, we store a refresh token to read and write calendar events on
                  your behalf.
                </li>
              </ul>
            </Subsection>
            <Subsection title="Information collected automatically">
              <ul className="list-disc pl-6 space-y-2 body-md text-muted-foreground">
                <li>
                  <strong className="text-foreground">Usage data:</strong> Pages visited, features
                  used, and timestamps of activity.
                </li>
                <li>
                  <strong className="text-foreground">Device information:</strong> Browser type,
                  operating system, and IP address.
                </li>
              </ul>
            </Subsection>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="list-disc pl-6 space-y-2 body-md text-muted-foreground">
              <li>To provide and operate the Service, including creating and managing bookings.</li>
              <li>
                To send transactional emails such as booking confirmations, cancellations, and
                reschedule notifications.
              </li>
              <li>To verify your email address and authenticate your identity.</li>
              <li>To sync bookings with your connected Google Calendar.</li>
              <li>To improve the Service through usage analytics.</li>
              <li>To communicate with you about important service updates.</li>
            </ul>
          </Section>

          <Section title="3. How We Share Your Information">
            <p className="body-md text-muted-foreground mb-4">
              We do not sell your personal information. We may share information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 body-md text-muted-foreground">
              <li>
                <strong className="text-foreground">Service providers:</strong> Third-party vendors
                (e.g., email delivery, cloud hosting) that help us operate the Service, subject to
                confidentiality obligations.
              </li>
              <li>
                <strong className="text-foreground">Google:</strong> When you use the Google
                Calendar integration, data is shared with Google in accordance with their privacy
                policy.
              </li>
              <li>
                <strong className="text-foreground">Legal requirements:</strong> If required by law,
                court order, or governmental authority.
              </li>
            </ul>
          </Section>

          <Section title="4. Data Retention">
            <p className="body-md text-muted-foreground">
              We retain your account information for as long as your account is active. Booking
              records are retained for a minimum of 12 months to support dispute resolution and
              reporting. You may request deletion of your account and associated data at any time by
              contacting us.
            </p>
          </Section>

          <Section title="5. Security">
            <p className="body-md text-muted-foreground">
              We use industry-standard security measures including password hashing (bcrypt), HTTPS
              encryption in transit, and secure token storage. No method of transmission over the
              internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <p className="body-md text-muted-foreground mb-4">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 body-md text-muted-foreground">
              <li>Access the personal information we hold about you.</li>
              <li>Correct inaccurate information.</li>
              <li>Request deletion of your personal data.</li>
              <li>Object to or restrict certain processing of your data.</li>
              <li>Withdraw consent at any time where processing is based on consent.</li>
            </ul>
            <p className="body-md text-muted-foreground mt-4">
              To exercise any of these rights, please contact us at{" "}
              <a
                href={`mailto:privacy@${appHost}`}
                className="text-primary underline underline-offset-2"
              >
                privacy@{appHost}
              </a>
              .
            </p>
          </Section>

          <Section title="7. Cookies">
            <p className="body-md text-muted-foreground">
              We use localStorage to store your authentication session. We do not use third-party
              tracking cookies. We may use first-party cookies for essential functionality such as
              maintaining your login state.
            </p>
          </Section>

          <Section title="8. Children's Privacy">
            <p className="body-md text-muted-foreground">
              The Service is not directed to children under 13 years of age. We do not knowingly
              collect personal information from children under 13. If you believe we have
              inadvertently collected such information, please contact us immediately.
            </p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p className="body-md text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of significant
              changes by email or by posting a prominent notice on the Service. Your continued use
              of the Service after changes take effect constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section title="10. Contact Us">
            <p className="body-md text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us at{" "}
              <a
                href={`mailto:privacy@${appHost}`}
                className="text-primary underline underline-offset-2"
              >
                privacy@{appHost}
              </a>
              .
            </p>
          </Section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="SyncBooker"
                width={20}
                height={20}
                className="w-full max-w-[180px] h-auto"
              />
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy-policy"
                className="body-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-use"
                className="body-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Use
              </Link>
              <p className="body-sm text-muted-foreground">
                © 2026 SyncBooker. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="heading-sm">{title}</h2>
      {children}
    </section>
  );
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="body-md font-semibold">{title}</h3>
      {children}
    </div>
  );
}
