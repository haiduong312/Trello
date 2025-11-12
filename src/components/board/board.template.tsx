"use client";

import { useBoardId } from "@/libs/react-query/query/board.query";
import {
    useColumnByBoardId,
    useColumnByColumnId,
} from "@/libs/react-query/query/column.query";
import { usePathname } from "next/navigation";
import { Button, Card } from "antd";
import { useEffect, useState } from "react";
import "@/components/styles/board.style.scss";
import BoardHeader from "../header/board.header";
import React from "react";
import { useCreateColumn } from "@/libs/react-query/mutation/column.mutation";
import { CloseOutlined } from "@ant-design/icons";
import {
    DndContext,
    DragEndEvent,
    useSensor,
    MouseSensor,
    TouchSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragOverEvent,
    DragStartEvent,
    closestCenter,
    closestCorners,
} from "@dnd-kit/core";
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
} from "@dnd-kit/sortable";
import { cardService, columnService } from "@/libs/services";
import Column from "./column";
import {
    useCardsByBoardId,
    useCardsByColumnId,
} from "@/libs/react-query/query/card.query";
import CardItem from "./card";

const BoardTemplate = () => {
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: { distance: 10 },
    });
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: { delay: 200, tolerance: 5 },
    });
    const sensors = useSensors(mouseSensor, touchSensor);
    const currentPathName = usePathname();
    const pathName = currentPathName.split("/board/")[1];
    const { data: columns } = useColumnByBoardId(pathName);
    const { data: board, isLoading } = useBoardId(pathName);
    const { data: cards } = useCardsByBoardId(pathName);
    const [activeAddCardColumnId, setActiveAddCardColumnId] = useState<
        string | null
    >(null);
    const [activeAddColumn, setActiveAddColumn] = useState<boolean>(false);
    const [columnTitle, setColumnTitle] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { mutate: createColumn } = useCreateColumn();
    const [localColumns, setLocalColumns] = useState(columns || []);
    const [localCards, setLocalCards] = useState<ICard[]>(cards || []);
    const [activeDragType, setActiveDragType] = useState<
        "column" | "card" | null
    >(null);
    const [activeDragColumnData, setActiveDragColumnData] =
        useState<IColumn | null>(null);
    const [activeDragCardData, setActiveDragCardData] = useState<ICard | null>(
        null
    );
    useEffect(() => {
        if (columns) setLocalColumns(columns);
        if (cards) setLocalCards(cards);
    }, [columns, cards]);

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
            setColumnTitle("");
            setActiveAddColumn(false);
        } catch (err) {
            console.error("Add card failed:", err);
        } finally {
            setLoading(false);
        }
    };
    if (isLoading || !board) {
        return <div>Loading...</div>;
    }
    const handleDragStart = (e: DragStartEvent) => {
        const type = e.active.data.current?.type;
        setActiveDragType(type || null);
        if (e.active.data.current) {
            setActiveDragColumnData(e.active.data.current as IColumn);
            setActiveDragCardData(e.active.data.current.data as ICard);
        } else {
            setActiveDragColumnData(null);
        }
    };
    const handleDragOver = (e: DragOverEvent) => {
        console.log("drag over", e);
        if (activeDragType === "column") {
            // không làm gì thêm nếu kéo column
            return;
        }
        const { active, over } = e;
        if (!over || !active) return;
        const overDataType = over?.data?.current?.type;
        console.log("over data0:", overDataType);
        if (over && active && overDataType) {
            console.log("over data1: ", overDataType);
            const activeCardData = active?.data?.current?.data;
            const overCardData = over?.data?.current?.data;
            if (!activeCardData || !overCardData) return;
            console.log("over data2: ", overDataType);

            // Trường hợp 1: over là column (thả card vào column trống hoặc dưới cùng)
            if (overDataType === "column") {
                console.log("column");
                const overColumnId = over?.data?.current?.data.id; // id của column
                if (activeCardData.column_id !== overColumnId) {
                    setLocalCards((prev) =>
                        prev.map((card) =>
                            card.id === activeCardData.id
                                ? {
                                      ...card,
                                      column_id: overColumnId,
                                  }
                                : card
                        )
                    );
                }
                return;
            } else {
                if (activeCardData.column_id !== overCardData.column_id) {
                    setLocalCards((prev) => {
                        return prev.map((card) => {
                            if (card.id === activeCardData.id) {
                                return {
                                    ...card,
                                    column_id: overCardData.column_id,
                                };
                            }
                            return card;
                        });
                    });
                    return;
                }
            }
        }
    };
    const handleDragEnd = async (e: DragEndEvent) => {
        // console.log(e);
        const { active, over } = e;
        if (!over) return;

        if (activeDragType === "column") {
            if (active?.id !== over?.id) {
                // Lấy vị trí cũ từ active
                const oldIndex = localColumns.findIndex(
                    (c) => c.id === active.id
                );

                // Lấy vị trí mới từ active
                const newIndex = localColumns.findIndex(
                    (c) => c.id === over?.id
                );

                const reordered = arrayMove(localColumns, oldIndex, newIndex);
                setLocalColumns(reordered);

                // Gọi RPC cập nhật DB
                const updatedPositions = reordered.map((col, index) => ({
                    id: col.id,
                    position: index + 1,
                }));

                try {
                    await columnService.updateColumnPositions(updatedPositions);
                } catch (err) {
                    console.error("Lỗi khi cập nhật vị trí:", err);
                }
            }
        }
        if (activeDragType === "card") {
            if (active?.id !== over?.id) {
                // Lấy vị trí cũ từ active
                const oldIndex = localCards.findIndex(
                    (c) => c.id === active.id
                );

                // Lấy vị trí mới từ active
                const newIndex = localCards.findIndex((c) => c.id === over?.id);

                const reordered = arrayMove(localCards, oldIndex, newIndex);
                setLocalCards(reordered);

                // Gọi RPC cập nhật DB
                const updatedPositions = reordered.map((card, index) => ({
                    id: card.id,
                    position: index + 1,
                    column_id: card.column_id,
                }));

                try {
                    await cardService.updateCardPositions(updatedPositions);
                } catch (err) {
                    console.error("Lỗi khi cập nhật vị trí:", err);
                }
            }
        }
        setActiveDragType(null);
        setActiveDragColumnData(null);
        setActiveDragCardData(null);
    };

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: "0.5",
                },
            },
        }),
    };
    console.log("active column data", activeDragColumnData);
    return (
        <DndContext
            onDragEnd={handleDragEnd}
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            collisionDetection={closestCorners}
        >
            <SortableContext
                items={localColumns.map((col) => col.id)}
                strategy={horizontalListSortingStrategy}
            >
                <div
                    style={{
                        backgroundImage: `url("${board.backgroundUrl}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: "100vh",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div style={{ flex: "0 0 auto" }}>
                        <BoardHeader name={board.title} />
                    </div>
                    <div className="column-scroll-area">
                        <div className="column-container">
                            {localColumns?.map((col) => (
                                <Column
                                    key={col.id}
                                    col={col}
                                    cards={localCards.filter(
                                        (card) => card.column_id === col.id
                                    )}
                                    activeAddCardColumnId={
                                        activeAddCardColumnId
                                    }
                                    setActiveAddCardColumnId={
                                        setActiveAddCardColumnId
                                    }
                                    activeDragType={activeDragType}
                                />
                            ))}
                            <DragOverlay dropAnimation={dropAnimation}>
                                {activeDragType === "column" &&
                                    activeDragColumnData && (
                                        <Column
                                            col={activeDragColumnData}
                                            activeAddCardColumnId={null}
                                            setActiveAddCardColumnId={() => {}}
                                            activeDragType="column"
                                            cards={localCards.filter(
                                                (card) =>
                                                    card.column_id ===
                                                    activeDragColumnData.id
                                            )}
                                        />
                                    )}
                                {activeDragType === "card" &&
                                    activeDragCardData && (
                                        <CardItem
                                            activeDragType="card"
                                            card={activeDragCardData}
                                        />
                                    )}
                            </DragOverlay>

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
                                                    background:
                                                        "rgb(0 0 0 / 4%)",
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
                                                    background:
                                                        "rgb(245 245 245)",
                                                    outline: "none",
                                                    width: "100%",
                                                    padding: 5,
                                                    borderRadius: 8,
                                                }}
                                                value={columnTitle}
                                                onChange={(e) =>
                                                    setColumnTitle(
                                                        e.target.value
                                                    )
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
                                            backgroundColor:
                                                "rgba(255, 255, 255, 0.15)",
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
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default BoardTemplate;
