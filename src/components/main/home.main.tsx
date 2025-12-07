"use client";

import { SignedOut, SignUpButton } from "@clerk/nextjs";
import { Button, Card, Row, Col } from "antd";
import {
    CheckSquareOutlined,
    TeamOutlined,
    ThunderboltOutlined,
    SafetyOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import GuestHeader from "../header/guest.header";

const HomeMain = () => {
    const features = [
        {
            icon: (
                <CheckSquareOutlined
                    style={{ fontSize: 24, color: "#2563eb" }}
                />
            ),
            title: "Task Management",
            description:
                "Organize your tasks with intuitive drag-and-drop boards",
        },
        {
            icon: <TeamOutlined style={{ fontSize: 24, color: "#2563eb" }} />,
            title: "Team Collaboration",
            description: "Work together with your team in real-time",
        },
        {
            icon: (
                <ThunderboltOutlined
                    style={{ fontSize: 24, color: "#2563eb" }}
                />
            ),
            title: "Lightning Fast",
            description: "Built with Next.js 15 for optimal performance",
        },
        {
            icon: <SafetyOutlined style={{ fontSize: 24, color: "#2563eb" }} />,
            title: "Secure",
            description: "Enterprise-grade security with Clerk authentication",
        },
    ];

    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(to bottom right, #eff6ff, #ffffff, #f5f3ff)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <GuestHeader />

            {/* Hero Section */}
            <section style={{ padding: "80px 16px", textAlign: "center" }}>
                <div style={{ maxWidth: 900, margin: "0 auto" }}>
                    <h1
                        style={{
                            fontSize: "clamp(32px, 6vw, 56px)",
                            fontWeight: "bold",
                            color: "#111827",
                            marginBottom: 24,
                        }}
                    >
                        Organize work and life,{" "}
                        <span style={{ color: "#2563eb" }}>finally.</span>
                    </h1>

                    <p
                        style={{
                            fontSize: "clamp(16px, 2.5vw, 20px)",
                            color: "#4b5563",
                            marginBottom: 32,
                            maxWidth: 600,
                            marginInline: "auto",
                        }}
                    >
                        TrelloClone helps teams move work forward. Collaborate,
                        manage projects, and reach new productivity peaks.
                    </p>

                    <SignedOut>
                        <Row gutter={[16, 16]} justify="center">
                            <Col xs={18} sm={12} md={8}>
                                <SignUpButton>
                                    <Button
                                        type="primary"
                                        size="large"
                                        block
                                        icon={<ArrowRightOutlined />}
                                    >
                                        Start for free
                                    </Button>
                                </SignUpButton>
                            </Col>
                        </Row>
                    </SignedOut>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: "80px 16px" }}>
                <div style={{ textAlign: "center", marginBottom: 64 }}>
                    <h2
                        style={{
                            fontSize: 32,
                            fontWeight: "bold",
                            color: "#111827",
                            marginBottom: 16,
                        }}
                    >
                        Everything you need to stay organized
                    </h2>
                    <p
                        style={{
                            fontSize: 18,
                            color: "#4b5563",
                            maxWidth: 600,
                            margin: "0 auto",
                        }}
                    >
                        Powerful features to help your team collaborate and get
                        more done.
                    </p>
                </div>

                <Row
                    gutter={[24, 24]}
                    style={{ maxWidth: 1200, margin: "0 auto" }}
                >
                    {features.map((feature, index) => (
                        <Col key={index} xs={24} sm={12} md={12} lg={6} xl={6}>
                            <Card
                                hoverable
                                style={{
                                    border: "none",
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                    textAlign: "center",
                                    padding: 16,
                                    height: "100%",
                                }}
                            >
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 8,
                                        background: "#dbeafe",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 16px",
                                    }}
                                >
                                    {feature.icon}
                                </div>
                                <h3
                                    style={{
                                        fontSize: 18,
                                        marginBottom: 8,
                                    }}
                                >
                                    {feature.title}
                                </h3>
                                <p style={{ color: "#6b7280" }}>
                                    {feature.description}
                                </p>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>
        </div>
    );
};

export default HomeMain;
