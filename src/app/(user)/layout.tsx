import AppHeader from "@/components/header/app.header";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Boards | Trello",
  description: "Trello's Home Page",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}
