import type { Metadata } from "next";
import "antd/dist/reset.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { siteConfig } from "@/config/site";
import { QueryProvider } from "@/libs/react-query/query.provider";
import NprogressProviders from "@/libs/nprogress/nprogress.wrapper";

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
    return (
        <html lang="en">
            <body className={inter.className}>
                <NprogressProviders>
                    <AntdRegistry>
                        <QueryProvider>
                            <ClerkProvider>{children}</ClerkProvider>
                        </QueryProvider>
                    </AntdRegistry>
                </NprogressProviders>
            </body>
        </html>
    );
}
