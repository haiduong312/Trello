"use client";

import { Button, Avatar, Typography, Space } from "antd";
import {
    StarOutlined,
    StarFilled,
    LockOutlined,
    TeamOutlined,
    EllipsisOutlined,
    UserAddOutlined,
    BugOutlined,
    FolderOpenOutlined,
    ThunderboltOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import "@/components/styles/board.style.scss";
import { UserButton } from "@clerk/nextjs";

const { Text } = Typography;

interface BoardHeaderProps {
    name: string;
}

const BoardHeader = ({ name }: BoardHeaderProps) => {
    return (
        <div className="board-header">
            <Space className="left-section" size="middle">
                <Text
                    className="board-name"
                    style={{
                        fontSize: 20,
                        fontWeight: 600,
                        color: "white",
                    }}
                >
                    {name}
                </Text>
            </Space>

            <Space className="right-section" size="small">
                <div className="icon">
                    <UserButton />
                </div>
                <div className="icon">
                    <BugOutlined />
                </div>
                <div className="icon">
                    <FolderOpenOutlined />
                </div>
                <div className="icon">
                    <ThunderboltOutlined />
                </div>
                <div>
                    <EllipsisOutlined />
                </div>
            </Space>
        </div>
    );
};

export default BoardHeader;
