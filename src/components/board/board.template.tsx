"use client";

import { useBoardId } from "@/libs/react-query/query/board.query";
import { useColumnById } from "@/libs/react-query/query/column.query";
import { usePathname } from "next/navigation";
import { Card, Typography, Button, Modal, Input, Space } from "antd";
import { useState } from "react";
import "@/components/styles/board.style.scss";
import { Metadata } from "next";
const { Title, Text } = Typography;

const BoardTemplate = () => {
    const currentPathName = usePathname();
    const pathName = currentPathName.split("/board/")[1];
    const { data: column } = useColumnById(pathName);
    const { data: board, isLoading } = useBoardId(pathName);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState("");
    const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
    const card = true;
    if (isLoading || !board) {
        return <div>Loading...</div>;
    }

    const handleAddTask = (columnId: string) => {
        setSelectedColumn(columnId);
        setIsModalOpen(true);
    };

    const handleOk = () => {};

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div
            style={{
                backgroundImage: `url("${board.backgroundUrl}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "100vh",
                width: "100vw",
            }}
        >
            <div className="column-container">
                {column?.map((col, idx) => (
                    <Card
                        key={col.id}
                        className="column-content"
                        styles={{
                            body: {
                                padding: 15,
                                display: "flex",
                                flexDirection: "column",
                            },
                        }}
                    >
                        <Title level={5}>{col.title}</Title>
                        {/* Hiển thị danh sách task */}
                        {card ? (
                            <div style={{ flex: 1, overflowY: "auto" }}>
                                <Card
                                    key={idx}
                                    size="small"
                                    styles={{
                                        body: {
                                            padding: 8,
                                            background: "rgb(0 0 0 / 4%)",
                                            borderRadius: 8,
                                        },
                                    }}
                                    className="card"
                                >
                                    <Text>{col.title}</Text>
                                </Card>
                            </div>
                        ) : (
                            <></>
                        )}

                        {/* Nút thêm task */}
                        <Button
                            color="default"
                            variant="filled"
                            block
                            style={{ marginTop: "8px" }}
                            onClick={() => handleAddTask(col.id)}
                        >
                            + Add A Card
                        </Button>
                    </Card>
                ))}
            </div>

            {/* Modal thêm task */}
            <Modal
                title="Add New Task"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Add"
            >
                <Space direction="vertical" style={{ width: "100%" }}>
                    <Text>Card Title</Text>
                    <Input
                        placeholder="Enter task name..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                </Space>
            </Modal>
        </div>
    );
};

export default BoardTemplate;
