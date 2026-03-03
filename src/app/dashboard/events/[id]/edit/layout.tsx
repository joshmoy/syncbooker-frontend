import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Event Type" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
