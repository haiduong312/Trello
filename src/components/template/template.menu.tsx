"use client";
import React, { useState } from "react";
import {
    CloudOutlined,
    HomeOutlined,
    ProjectOutlined,
    ScheduleOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import "@/components/styles/template.style.scss";
import { useOrganization } from "@clerk/nextjs";
import Link from "next/link";

type MenuItem = Required<MenuProps>["items"][number];

const TemplateMenu: React.FC = () => {
    const { organization } = useOrganization();
    const orgId = organization?.id ?? "personal";

    const items: MenuItem[] = [
        {
            key: "sub1",
            label: <Link href={`/dashboard/${orgId}`}>Boards</Link>,
            icon: <ProjectOutlined />,
        },
        {
            key: "sub2",
            label: (
                <div
                    onClick={() => setSelectedKeys(["sub2"])}
                    style={{ cursor: "pointer" }}
                >
                    Templates
                </div>
            ),
            icon: <ScheduleOutlined />,
            children: [
                { key: "1", label: "Business" },
                { key: "2", label: "Design" },
                { key: "3", label: "Education" },
                { key: "4", label: "Engineering" },
                { key: "5", label: "Marketing" },
                { key: "6", label: "HR & Operations" },
                { key: "7", label: "Personal" },
                { key: "8", label: "Productivity" },
                { key: "9", label: "Product Management" },
                { key: "10", label: "Project Management" },
                { key: "11", label: "Remote Works" },
                { key: "12", label: "Sales" },
                { key: "13", label: "Support" },
                { key: "14", label: "Team Management" },
            ],
        },
        {
            key: "sub3",
            label: "Home",
            icon: <HomeOutlined />,
        },
        {
            type: "divider",
        },
        {
            key: "grp",
            label: "Workspaces",
            type: "group",
        },
        {
            key: "sub4",
            label: "Trello Workspace",
            icon: <CloudOutlined />,
        },
    ];

    const [selectedKeys, setSelectedKeys] = useState(["sub2"]);

    const onClick: MenuProps["onClick"] = (info) => {
        setSelectedKeys([info.key]);
    };

    return (
        <div className="sidebar-menu-wrapper">
            <Menu
                style={{ width: 256, fontWeight: 600 }}
                mode="inline"
                items={items}
                expandIcon={false}
                openKeys={["sub2"]}
                selectable={true}
                selectedKeys={selectedKeys}
                onClick={onClick}
            />
        </div>
    );
};

export default TemplateMenu;
