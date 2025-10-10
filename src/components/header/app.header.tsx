"use client";

import { AppstoreOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Layout, Popover } from "antd";
import "@/components/styles/header.style.scss";
import Image from "next/image";
import {
    OrganizationSwitcher,
    useAuth,
    useOrganization,
    UserButton,
    useUser,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
export default function AppHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const { orgId } = useAuth();
    const { user } = useUser();

    useEffect(() => {
        if (!user) return;

        if (orgId) {
            if (!pathname.includes(`/dashboard/${orgId}`)) {
                router.push(`/dashboard/${orgId}`);
            }
        } else {
            if (!pathname.includes(`/dashboard/personal`)) {
                router.push(`/dashboard/personal`);
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
                    <div className="app-icon">
                        <Image
                            src="/assets/trello-icon.svg"
                            alt="trello"
                            width={25}
                            height={25}
                        />
                        <div className="title">Trello</div>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Input
                        placeholder="Search"
                        prefix={<SearchOutlined />}
                        style={{ width: "780px" }}
                        className="trello-input"
                    />
                    <Button style={{ marginLeft: 8 }} type="primary">
                        Search
                    </Button>
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
