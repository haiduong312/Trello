"use client";
import React from "react";
import {
    CloudOutlined,
    HomeOutlined,
    ProjectOutlined,
    ScheduleOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import Link from "next/link";
type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
    {
        key: "sub1",
        label: "Boards",
        icon: <ProjectOutlined />,
    },
    {
        key: "sub2",
        label: <Link href="/template">Templates</Link>,
        icon: <ScheduleOutlined />,
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

const BoardMenu: React.FC = () => {
    const onClick: MenuProps["onClick"] = (e) => {
        console.log("click ", e);
    };

    return (
        <Menu
            onClick={onClick}
            style={{ width: 256, fontWeight: 600 }}
            defaultSelectedKeys={["sub1"]}
            mode="inline"
            items={items}
        />
    );
};

export default BoardMenu;
