import AppHeader from "@/components/header/app.header";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Boards",
  description: "Trello's Board Page",
};
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}
