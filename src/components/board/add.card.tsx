"use client";

import { Card, Typography, Button, Popconfirm } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useCardsByColumnId } from "@/libs/react-query/query/card.query";
import { useState } from "react";
import "@/components/styles/board.style.scss";
import { useCreateCards } from "@/libs/react-query/mutation/card.mutation";
const { Title, Text } = Typography;

interface IProps {
    col: IColumn; // Dữ liệu của từng cột
    deleteColumn: (columnId: string) => void; // Hàm xóa cột
    activeAddCardColumnId: string | null; // ID cột đang được mở input thêm card
    setActiveAddCardColumnId: React.Dispatch<
        React.SetStateAction<string | null>
    >; // Hàm thay đổi ID cột đang mở input
}

const AddCard = ({
    col,
    deleteColumn,
    activeAddCardColumnId,
    setActiveAddCardColumnId,
}: IProps) => {
    const { data: cards, isLoading } = useCardsByColumnId(col.id);
    const [cardTitle, setCardTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const { mutate: createCard } = useCreateCards();
    const handleCardOk = async (columnId: string, cardTitle: string) => {
        if (columnId && cardTitle) {
            await createCard(
                {
                    column_id: columnId,
                    title: cardTitle,
                },
                {
                    onSuccess: () => {
                        setActiveAddCardColumnId(null);
                    },
                }
            );
        }
    };
    const handleAddCard = async () => {
        if (!cardTitle.trim()) return;
        setLoading(true);
        try {
            await handleCardOk(col.id, cardTitle);
            setCardTitle(""); // ✅ reset input
            setActiveAddCardColumnId(null); // ✅ đóng form
        } catch (err) {
            console.error("Add card failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
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
            {/* Header của column */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Title level={5}>{col.title}</Title>
                <Popconfirm
                    title="Delete the task"
                    description="Are you sure to delete this task?"
                    onConfirm={() => deleteColumn(col.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <CloseOutlined />
                </Popconfirm>
            </div>

            {/* Hiển thị danh sách card */}
            <div style={{ flex: 1, overflowY: "auto" }}>
                {isLoading ? (
                    <Text>Loading...</Text>
                ) : (
                    cards?.map((card) => (
                        <Card
                            key={card.id}
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
                            <Text>{card.title}</Text>
                        </Card>
                    ))
                )}
            </div>

            {/* Nút thêm card */}
            {activeAddCardColumnId === col.id ? (
                <div>
                    <Card
                        size="small"
                        style={{ marginTop: 10 }}
                        styles={{
                            body: {
                                padding: 8,
                                background: "rgb(0 0 0 / 4%)",
                                borderRadius: 8,
                            },
                        }}
                        className="card"
                    >
                        <textarea
                            placeholder="Please enter your card's title"
                            style={{
                                border: "none",
                                background: "rgb(245 245 245)",
                                outline: "none",
                                width: "100%",
                            }}
                            value={cardTitle}
                            onChange={(e) => setCardTitle(e.target.value)}
                        />
                    </Card>
                    <div
                        style={{
                            marginTop: 10,
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}
                    >
                        <Button
                            color="primary"
                            variant="solid"
                            style={{ marginRight: 5 }}
                            onClick={handleAddCard}
                            loading={loading}
                        >
                            Add
                        </Button>
                        <div
                            className="close-btn"
                            onClick={() => {
                                (setActiveAddCardColumnId(null),
                                    setCardTitle(""));
                            }}
                        >
                            <CloseOutlined />
                        </div>
                    </div>
                </div>
            ) : (
                <Button
                    color="default"
                    variant="filled"
                    block
                    style={{ marginTop: "8px" }}
                    onClick={() => setActiveAddCardColumnId(col.id)}
                >
                    + Add a Card
                </Button>
            )}
        </Card>
    );
};

export default AddCard;
