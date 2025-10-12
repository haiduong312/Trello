import type { Metadata } from "next";
import "antd/dist/reset.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { siteConfig } from "@/config/site";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { QueryProvider } from "@/libs/react-query/query.provider";

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
  const queryClient = new QueryClient();
  return (
    <html lang="en">
      <AntdRegistry>
        <QueryProvider>
          <ClerkProvider>
            <body className={inter.className}>{children}</body>
          </ClerkProvider>
        </QueryProvider>
      </AntdRegistry>
    </html>
  );
}
