"use client";

import { useBoardId } from "@/libs/react-query/query/board.query";
import { useColumnById } from "@/libs/react-query/query/column.query";
import { usePathname } from "next/navigation";
import { Button, Card } from "antd";
import { useState } from "react";
import "@/components/styles/board.style.scss";
import BoardHeader from "../header/board.header";
import React from "react";
import {
    useCreateColumn,
    useDeleteColumn,
} from "@/libs/react-query/mutation/column.mutation";
import { useCreateCards } from "@/libs/react-query/mutation/card.mutation";
import AddCard from "./add.card";
import { CloseOutlined } from "@ant-design/icons";

const BoardTemplate = () => {
    const currentPathName = usePathname();
    const pathName = currentPathName.split("/board/")[1];
    const { data: columns } = useColumnById(pathName);
    const { data: board, isLoading } = useBoardId(pathName);
    const [activeAddCardColumnId, setActiveAddCardColumnId] = useState<
        string | null
    >(null);
    const [activeAddColumn, setActiveAddColumn] = useState<boolean>(false);
    const [columnTitle, setColumnTitle] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { mutate: deleteColumn } = useDeleteColumn();
    const { mutate: createColumn } = useCreateColumn();
    const handleColumnOk = async (boardId: string, cardTitle: string) => {
        if (boardId && cardTitle) {
            await createColumn(
                {
                    board_id: boardId,
                    title: cardTitle,
                },
                {
                    onSuccess: () => {
                        setActiveAddColumn(false);
                    },
                }
            );
        }
    };
    const handleAddColumn = async () => {
        if (!columnTitle.trim()) return;
        setLoading(true);
        try {
            await handleColumnOk(pathName, columnTitle);
            setColumnTitle(""); // ✅ reset input
            setActiveAddColumn(false); // ✅ đóng form
        } catch (err) {
            console.error("Add card failed:", err);
        } finally {
            setLoading(false);
        }
    };
    if (isLoading || !board) {
        return <div>Loading...</div>;
    }

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
            <div>
                <BoardHeader name={board.title} />
            </div>
            <div className="column-container">
                {columns?.map((col) => (
                    <AddCard
                        key={col.id}
                        col={col}
                        deleteColumn={deleteColumn}
                        activeAddCardColumnId={activeAddCardColumnId}
                        setActiveAddCardColumnId={setActiveAddCardColumnId}
                    />
                ))}

                <div style={{ marginTop: 0 }}>
                    {activeAddColumn ? (
                        <Card
                            className="column-content"
                            style={{ marginTop: 0 }}
                            styles={{
                                body: {
                                    padding: 15,
                                    display: "flex",
                                    flexDirection: "column",
                                },
                            }}
                        >
                            <Card
                                size="small"
                                styles={{
                                    body: {
                                        padding: 0,
                                        background: "rgb(0 0 0 / 4%)",
                                        borderRadius: 8,
                                        marginBottom: 0,
                                    },
                                }}
                                className="column"
                            >
                                <input
                                    type="text"
                                    placeholder="Please enter your card's title"
                                    style={{
                                        border: "none",
                                        background: "rgb(245 245 245)",
                                        outline: "none",
                                        width: "100%",
                                        padding: 5,
                                        borderRadius: 8,
                                    }}
                                    value={columnTitle}
                                    onChange={(e) =>
                                        setColumnTitle(e.target.value)
                                    }
                                />
                            </Card>
                            <div
                                style={{
                                    marginTop: 6,
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                }}
                            >
                                <Button
                                    color="primary"
                                    variant="solid"
                                    style={{ marginRight: 5 }}
                                    onClick={handleAddColumn}
                                    loading={loading}
                                >
                                    Add
                                </Button>
                                <div
                                    className="close-btn"
                                    onClick={() => {
                                        (setActiveAddColumn(false),
                                            setColumnTitle(""));
                                    }}
                                >
                                    <CloseOutlined />
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <Button
                            color="default"
                            type="text"
                            variant="outlined"
                            block
                            style={{
                                backgroundColor: "rgba(255, 255, 255, 0.15)",
                                backdropFilter: "blur(2px)",
                                fontSize: 16,
                                color: "black",
                                marginTop: 0,
                            }}
                            onClick={() => setActiveAddColumn(true)}
                        >
                            + Add another column
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BoardTemplate;
