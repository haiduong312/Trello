"use client";

import { AppstoreOutlined } from "@ant-design/icons";
import { Layout, Popover } from "antd";
import "@/components/styles/header.style.scss";
import Image from "next/image";
import {
    OrganizationSwitcher,
    useAuth,
    UserButton,
    useUser,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Link from "next/link";
import TrelloSearch from "../template/trello.search";
import { useMostPopularBoard } from "@/libs/react-query/query/board.query";

export default function AppHeader() {
    const { data: mostPopularBoards } = useMostPopularBoard();
    const router = useRouter();
    const pathname = usePathname();
    const { orgId } = useAuth();
    const { user } = useUser();
    const prevOrgId = useRef<string | null>(null);
    useEffect(() => {
        if (!user) return;

        // Chỉ redirect khi orgId đổi so với lần trước
        if (orgId !== prevOrgId.current) {
            prevOrgId.current = orgId ?? null;

            // Chỉ redirect nếu đang ở vùng dashboard
            if (pathname.startsWith("/dashboard")) {
                const target = orgId
                    ? `/dashboard/${orgId}`
                    : `/dashboard/personal`;
                router.replace(target); // replace để tránh thêm vào history
            }
        }
    }, [orgId, user, pathname, router]);
    return (
        <Layout>
            <Layout.Header
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 8,
                    background: "white",
                    height: 48,
                    borderBottom: "1px solid #d9d9d9",
                }}
            >
                <div
                    style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "20px",
                        marginRight: "20px",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <div className="options-icon">
                        <AppstoreOutlined
                            style={{
                                color: "rgba(80,82,88,1)",
                                fontSize: 20,
                                paddingLeft: 10,
                                paddingRight: 10,
                            }}
                        />
                    </div>
                    <Link href={"/"} className="app-icon">
                        <Image
                            src="/assets/trello-icon.svg"
                            alt="trello"
                            width={25}
                            height={25}
                        />
                        <div className="title">Trello</div>
                    </Link>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    {mostPopularBoards && (
                        <TrelloSearch mostPopularBoards={mostPopularBoards} />
                    )}
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                    }}
                >
                    <OrganizationSwitcher
                        appearance={{
                            elements: {
                                rootBox: {
                                    width: "35px",
                                    height: "35px",
                                    marginRight: "150px",
                                },
                            },
                        }}
                    />

                    <Popover
                        placement="bottomRight"
                        content={<div>Account</div>}
                    >
                        <div className="ava">
                            <UserButton />
                        </div>
                    </Popover>
                </div>
            </Layout.Header>
        </Layout>
    );
}
