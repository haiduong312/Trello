"use client";

import { Layout, Menu } from "antd";

export default function AppHeader() {
    return (
        <Layout>
            <Layout.Header style={{ display: "flex", alignItems: "center" }}>
                <div
                    style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "20px",
                        marginRight: "20px",
                    }}
                >
                    Trello Clone
                </div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={["1"]}
                    items={[
                        { key: "1", label: "Dashboard" },
                        { key: "2", label: "Boards" },
                        { key: "3", label: "Profile" },
                    ]}
                    style={{ flex: 1, minWidth: 0 }}
                />
            </Layout.Header>
        </Layout>
    );
}
