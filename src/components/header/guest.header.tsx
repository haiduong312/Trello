"use client";

import {
    AppstoreOutlined,
    BellOutlined,
    NotificationOutlined,
    QuestionCircleOutlined,
    SearchOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Input, Layout, Popover } from "antd";
import "@/components/styles/header.style.scss";
import Image from "next/image";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
export default function GuestHeader() {
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

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                    }}
                >
                    <SignUpButton>
                        <Button
                            type="primary"
                            size="large"
                            style={{
                                fontSize: "16px",
                            }}
                        >
                            Sign Up
                        </Button>
                    </SignUpButton>
                    <SignInButton>
                        <Button
                            type="primary"
                            size="large"
                            style={{
                                fontSize: "16px",
                            }}
                        >
                            Sign In
                        </Button>
                    </SignInButton>
                </div>
            </Layout.Header>
        </Layout>
    );
}
