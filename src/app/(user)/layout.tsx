import AppHeader from "@/components/header/app.header";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Trello's Dashboard Page",
};
export default async function AppLayout({
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
