"use client";

import { SignUpButton, useUser } from "@clerk/nextjs";
import { Button, Card } from "antd";
import {
  CheckSquareOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import GuestHeader from "../header/guest.header";

const HomeMain = () => {
  const { isSignedIn } = useUser();

  const features = [
    {
      icon: <CheckSquareOutlined style={{ fontSize: 24, color: "#2563eb" }} />,
      title: "Task Management",
      description: "Organize your tasks with intuitive drag-and-drop boards",
    },
    {
      icon: <TeamOutlined style={{ fontSize: 24, color: "#2563eb" }} />,
      title: "Team Collaboration",
      description: "Work together with your team in real-time",
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: 24, color: "#2563eb" }} />,
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
              fontSize: "56px",
              fontWeight: "bold",
              color: "#111827",
              marginBottom: "24px",
            }}
          >
            Organize work and life,{" "}
            <span style={{ color: "#2563eb" }}>finally.</span>
          </h1>
          <p
            style={{
              fontSize: "20px",
              color: "#4b5563",
              marginBottom: "32px",
              maxWidth: 600,
              marginInline: "auto",
            }}
          >
            TrelloClone helps teams move work forward. Collaborate, manage
            projects, and reach new productivity peaks. From high rises to the
            home office, the way your team works is unique—accomplish it all
            with TrelloClone.
          </p>

          {!isSignedIn && (
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <SignUpButton>
                <Button
                  type="primary"
                  size="large"
                  style={{
                    fontSize: "16px",
                    padding: "8px 32px",
                  }}
                  icon={<ArrowRightOutlined />}
                >
                  Start for free
                </Button>
              </SignUpButton>
              <Button
                size="large"
                style={{
                  fontSize: "16px",
                  padding: "8px 32px",
                  borderColor: "#d1d5db",
                }}
              >
                Watch demo
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "80px 16px" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#111827",
              marginBottom: "16px",
            }}
          >
            Everything you need to stay organized
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "#4b5563",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            Powerful features to help your team collaborate and get more done.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              hoverable
              style={{
                border: "none",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                textAlign: "center",
                padding: "16px",
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
                  fontSize: "18px",
                  marginBottom: "8px",
                }}
              >
                {feature.title}
              </h3>
              <p style={{ color: "#6b7280" }}>{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
export default HomeMain;
