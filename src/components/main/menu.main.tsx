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

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "sub1",
    label: "Boards",
    icon: <ProjectOutlined />,
  },
  {
    key: "sub2",
    label: "Templates",
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
    children: [
      { key: "15", label: "Option 9" },
      { key: "16", label: "Option 10" },
      { key: "17", label: "Option 11" },
      { key: "18", label: "Option 12" },
    ],
  },
];

const MenuSLider: React.FC = () => {
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };

  return (
    <Menu
      onClick={onClick}
      style={{ width: 256, fontWeight: 600 }}
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      items={items}
    />
  );
};

export default MenuSLider;
