import type { Metadata } from "next";
import "antd/dist/reset.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { siteConfig } from "@/config/site";
import { ClerkContextProvider } from "@/libs/context/ClerkProvider";
import { currentUser } from "@clerk/nextjs/server";

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();
    const safeUser = user
        ? {
              id: user.id,
              full_name: user.firstName + user.lastName!,
              email: user.emailAddresses[0]?.emailAddress ?? "",
              avatar_url: user.imageUrl,
          }
        : null;
    return (
        <html lang="en">
            <AntdRegistry>
                <ClerkProvider>
                    <ClerkContextProvider user={safeUser}>
                        <body className={inter.className}>{children}</body>
                    </ClerkContextProvider>
                </ClerkProvider>
            </AntdRegistry>
        </html>
    );
}
