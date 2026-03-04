import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsOfUsePage() {
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
                <Button variant="ghost" size="sm">Log in</Button>
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
            <h1 className="heading-xl mb-3">Terms of Use</h1>
            <p className="body-sm text-muted-foreground">Last updated: March 4, 2026</p>
          </div>

          <p className="body-md text-muted-foreground">
            Please read these Terms of Use (&quot;Terms&quot;) carefully before using SyncBooker
            (&quot;Service&quot;) operated by SyncBooker (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree
            with any part of the Terms, you may not use the Service.
          </p>

          <Section title="1. Eligibility">
            <p className="body-md text-muted-foreground">
              You must be at least 13 years of age to use the Service. By using the Service, you
              represent that you meet this age requirement and that you have the legal capacity to
              enter into these Terms.
            </p>
          </Section>

          <Section title="2. Accounts">
            <ul className="list-disc pl-6 space-y-2 body-md text-muted-foreground">
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
              <li>You must provide accurate and complete information when creating your account.</li>
              <li>You may not use another person&apos;s account without permission.</li>
              <li>You must notify us immediately of any unauthorised use of your account at{" "}
                <a href="mailto:support@syncbooker.com" className="text-primary underline underline-offset-2">
                  support@syncbooker.com
                </a>.
              </li>
            </ul>
          </Section>

          <Section title="3. Acceptable Use">
            <p className="body-md text-muted-foreground mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 body-md text-muted-foreground">
              <li>Use the Service for any unlawful purpose or in violation of any regulations.</li>
              <li>Send spam, unsolicited messages, or harass other users or invitees.</li>
              <li>Attempt to gain unauthorised access to any part of the Service or its infrastructure.</li>
              <li>Interfere with or disrupt the integrity or performance of the Service.</li>
              <li>Scrape, crawl, or use automated means to access the Service without our prior consent.</li>
              <li>Use the Service to impersonate any person or entity.</li>
              <li>Upload or transmit viruses, malware, or any other malicious code.</li>
            </ul>
          </Section>

          <Section title="4. Booking Responsibilities">
            <ul className="list-disc pl-6 space-y-2 body-md text-muted-foreground">
              <li>You are solely responsible for the accuracy of the availability you set on the Service.</li>
              <li>You are responsible for honouring bookings made through your public booking page.</li>
              <li>SyncBooker is a scheduling tool only and is not a party to any meeting or arrangement made between you and your invitees.</li>
              <li>We are not responsible for any disputes, damages, or losses arising from meetings booked via the Service.</li>
            </ul>
          </Section>

          <Section title="5. Google Calendar Integration">
            <p className="body-md text-muted-foreground">
              By connecting your Google Calendar, you authorise SyncBooker to read your calendar events
              to determine your availability and to create or delete calendar events for confirmed bookings.
              You may revoke this access at any time from your account settings or through your Google
              Account permissions. Your use of Google services through the integration is also governed
              by{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                Google&apos;s Terms of Service
              </a>.
            </p>
          </Section>

          <Section title="6. Intellectual Property">
            <p className="body-md text-muted-foreground">
              The Service and its original content, features, and functionality are and will remain the
              exclusive property of SyncBooker. You retain ownership of content you upload (profile
              pictures, event descriptions). By uploading content, you grant us a non-exclusive,
              worldwide licence to display that content solely for the purpose of operating the Service.
            </p>
          </Section>

          <Section title="7. Limitation of Liability">
            <p className="body-md text-muted-foreground">
              To the maximum extent permitted by applicable law, SyncBooker shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, including but not limited
              to loss of profits, data, or goodwill, arising from your use of or inability to use the
              Service. Our total liability to you for any claim arising from these Terms or the Service
              shall not exceed the greater of $10 or the amount you paid to us in the 12 months preceding
              the claim.
            </p>
          </Section>

          <Section title="8. Disclaimer of Warranties">
            <p className="body-md text-muted-foreground">
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
              either express or implied, including but not limited to implied warranties of merchantability,
              fitness for a particular purpose, or non-infringement. We do not warrant that the Service
              will be uninterrupted, error-free, or free of harmful components.
            </p>
          </Section>

          <Section title="9. Termination">
            <p className="body-md text-muted-foreground">
              We may suspend or terminate your account and access to the Service at our discretion, with
              or without notice, for conduct that we believe violates these Terms or is harmful to other
              users, us, third parties, or for any other reason. You may terminate your account at any
              time by contacting us. Upon termination, your right to use the Service ceases immediately.
            </p>
          </Section>

          <Section title="10. Changes to Terms">
            <p className="body-md text-muted-foreground">
              We reserve the right to modify these Terms at any time. We will notify you of material
              changes by email or by posting a notice on the Service at least 14 days before the changes
              take effect. Your continued use of the Service after the effective date constitutes your
              acceptance of the revised Terms.
            </p>
          </Section>

          <Section title="11. Governing Law">
            <p className="body-md text-muted-foreground">
              These Terms are governed by and construed in accordance with applicable law. Any disputes
              arising from these Terms or the Service shall be subject to the exclusive jurisdiction of
              the courts in the relevant jurisdiction.
            </p>
          </Section>

          <Section title="12. Contact Us">
            <p className="body-md text-muted-foreground">
              If you have questions about these Terms, please contact us at{" "}
              <a href="mailto:legal@syncbooker.com" className="text-primary underline underline-offset-2">
                legal@syncbooker.com
              </a>.
            </p>
          </Section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="SyncBooker" width={20} height={20} />
              <span className="label-md">SyncBooker</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="body-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-use" className="body-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Use
              </Link>
              <p className="body-sm text-muted-foreground">© 2026 SyncBooker. All rights reserved.</p>
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
