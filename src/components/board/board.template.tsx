"use client";

import { useBoardId } from "@/libs/react-query/query/board.query";
import { useColumnByBoardId } from "@/libs/react-query/query/column.query";
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
import { useCardsByBoardId } from "@/libs/react-query/query/card.query";
import CardItem from "./card";
import EmptyDropZone from "./empty.dropzone";

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
    }, [columns]);

    useEffect(() => {
        if (cards) setLocalCards(cards);
    }, [cards]);

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

        if (type === "column") {
            setActiveDragColumnData(e.active.data.current as IColumn);
        } else if (type === "card") {
            setActiveDragCardData(e?.active?.data?.current?.data as ICard);
        } else {
            setActiveDragColumnData(null);
            setActiveDragCardData(null);
        }
    };

    const handleDragOver = (e: DragOverEvent) => {
        console.log(e);
        if (activeDragType === "column") {
            // không làm gì thêm nếu kéo column
            return;
        }
        const { active, over } = e;
        if (!over || !active) return;
        const overDataType = over?.data?.current?.type;

        const activeCardData = active?.data?.current?.data;
        const overCardData = over?.data?.current?.data;
        if (!activeCardData || !overCardData) return;

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
        }
        if (overDataType === "card") {
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
    };
    // const handleDragEnd = async (e: DragEndEvent) => {
    //     const { active, over } = e;
    //     if (!over) return;

    //     if (activeDragType === "column") {
    //         if (active?.id !== over?.id) {
    //             // Lấy vị trí cũ từ active
    //             const oldIndex = localColumns.findIndex(
    //                 (c) => c.id === active.id
    //             );

    //             // Lấy vị trí mới từ active
    //             const newIndex = localColumns.findIndex(
    //                 (c) => c.id === over?.id
    //             );

    //             const reordered = arrayMove(localColumns, oldIndex, newIndex);
    //             setLocalColumns(reordered);

    //             // Gọi RPC cập nhật DB
    //             const updatedPositions = reordered.map((col, index) => ({
    //                 id: col.id,
    //                 position: index + 1,
    //             }));

    //             try {
    //                 await columnService.updateColumnPositions(updatedPositions);
    //             } catch (err) {
    //                 console.error("Lỗi khi cập nhật vị trí:", err);
    //             }
    //         }
    //     }
    //     if (activeDragType !== "card") return;

    //     const activeCardId = active.id;
    //     const overCardId = over?.id;

    //     const activeCard = localCards.find((c) => c.id === activeCardId);
    //     if (!activeCard) return;

    //     const oldColumnId = activeCard.column_id;
    //     const newColumnId = over?.data?.current?.data.column_id;

    //     // ===================== //
    //     // === DI CHUYỂN CỘT === //
    //     // ===================== //

    //     if (oldColumnId !== newColumnId) {
    //         // Card trong column cũ
    //         const oldColumnCards = localCards
    //             .filter((c) => c.column_id === oldColumnId)
    //             .sort((a, b) => a.position - b.position);

    //         // Card trong column mới
    //         const newColumnCards = localCards
    //             .filter((c) => c.column_id === newColumnId)
    //             .sort((a, b) => a.position - b.position);

    //         // Xóa card khỏi column cũ
    //         const oldIndex = oldColumnCards.findIndex(
    //             (c) => c.id === activeCardId
    //         );
    //         oldColumnCards.splice(oldIndex, 1);

    //         // Tính vị trí mới
    //         let newIndex = 0;
    //         if (overCardId) {
    //             newIndex = newColumnCards.findIndex((c) => c.id === overCardId);
    //             if (newIndex === -1) newIndex = newColumnCards.length;
    //         }

    //         // Thêm card vào column mới tại vị trí mới
    //         newColumnCards.splice(newIndex, 0, {
    //             ...activeCard,
    //             column_id: newColumnId as string,
    //         });

    //         // Rebuild position
    //         const updatedOldCol = oldColumnCards.map((c, i) => ({
    //             ...c,
    //             position: i + 1,
    //         }));

    //         const updatedNewCol = newColumnCards.map((c, i) => ({
    //             ...c,
    //             position: i + 1,
    //         }));

    //         // Set lại local state
    //         const newLocalCards = [
    //             ...localCards.filter(
    //                 (c) =>
    //                     c.column_id !== oldColumnId &&
    //                     c.column_id !== newColumnId
    //             ),
    //             ...updatedOldCol,
    //             ...updatedNewCol,
    //         ];

    //         setLocalCards(newLocalCards);

    //         // Update DB
    //         try {
    //             // 1. Update column_id cho card
    //             await cardService.updateCard(activeCardId as string, {
    //                 column_id: newColumnId as string,
    //             });

    //             // 2. Update vị trí của cả hai column
    //             await cardService.updateCardPositions([
    //                 ...updatedOldCol.map((c) => ({
    //                     id: c.id,
    //                     position: c.position,
    //                     column_id: c.column_id,
    //                 })),
    //                 ...updatedNewCol.map((c) => ({
    //                     id: c.id,
    //                     position: c.position,
    //                     column_id: c.column_id,
    //                 })),
    //             ]);
    //         } catch (err) {
    //             console.error("Lỗi update column & position:", err);
    //         }

    //         return;
    //     }

    //     // ============================= //
    //     // === DI CHUYỂN TRONG COLUMN === //
    //     // ============================= //

    //     if (!over || active.id === over.id) return;

    //     const oldIndex = localCards.findIndex((c) => c.id === active.id);
    //     const newIndex = localCards.findIndex((c) => c.id === over.id);

    //     const reordered = arrayMove(localCards, oldIndex, newIndex);
    //     setLocalCards(reordered);

    //     const updatedPositions = reordered.map((card, index) => ({
    //         id: card.id,
    //         position: index + 1,
    //         column_id: card.column_id,
    //     }));

    //     try {
    //         await cardService.updateCardPositions(updatedPositions);
    //     } catch (err) {
    //         console.error("Lỗi update vị trí:", err);
    //     }

    //     setActiveDragType(null);
    //     setActiveDragColumnData(null);
    //     setActiveDragCardData(null);
    // };
    const handleDragEnd = async (e: DragEndEvent) => {
        const { active, over } = e;
        if (!active) return;

        // xử lý column reorder
        if (activeDragType === "column") {
            if (over && active.id !== over.id) {
                const oldIndex = localColumns.findIndex(
                    (c) => c.id === active.id
                );
                const newIndex = localColumns.findIndex(
                    (c) => c.id === over.id
                );
                if (
                    oldIndex !== -1 &&
                    newIndex !== -1 &&
                    oldIndex !== newIndex
                ) {
                    const reordered = arrayMove(
                        localColumns,
                        oldIndex,
                        newIndex
                    );
                    setLocalColumns(reordered);
                    const updatedPositions = reordered.map((col, idx) => ({
                        id: col.id,
                        position: idx + 1,
                    }));
                    try {
                        await columnService.updateColumnPositions(
                            updatedPositions
                        );
                    } catch (err) {
                        console.error("Lỗi khi cập nhật vị trí:", err);
                    }
                }
            }
        }

        if (activeDragType !== "card") {
            // reset state
            setActiveDragType(null);
            setActiveDragColumnData(null);
            setActiveDragCardData(null);
            return;
        }

        // Nếu drag card mà không có over => nothing
        if (!over) {
            setActiveDragType(null);
            setActiveDragColumnData(null);
            setActiveDragCardData(null);
            return;
        }

        // Lấy dữ liệu active và over từ data.current (an toàn hơn than .id)
        const activeData = active.data.current;
        const overData = over.data.current;

        if (!activeData || activeData.type !== "card") {
            // reset
            setActiveDragType(null);
            setActiveDragColumnData(null);
            setActiveDragCardData(null);
            return;
        }

        const activeCardId = (activeData.data as ICard).id;
        const activeCard = localCards.find((c) => c.id === activeCardId);
        if (!activeCard) {
            setActiveDragType(null);
            setActiveDragColumnData(null);
            setActiveDragCardData(null);
            return;
        }

        // Tìm newColumnId chính xác: nếu over là column => over.data.id, nếu over là card => over.data.column_id
        let newColumnId: string | null = null;
        if (overData?.type === "column") {
            newColumnId = (overData.data as IColumn).id;
        } else if (overData?.type === "card") {
            newColumnId = (overData.data as ICard).column_id;
        } else {
            // fallback: nếu over.id chứa column id (không khuyến khích)
            newColumnId = (over.id as string) || null;
        }

        const oldColumnId = activeCard.column_id;

        // Nếu chuyển cột
        if (oldColumnId !== newColumnId && newColumnId) {
            // Build lists per-column (sorted by position)
            const oldColumnCards = localCards
                .filter((c) => c.column_id === oldColumnId)
                .sort((a, b) => a.position - b.position);

            const newColumnCards = localCards
                .filter((c) => c.column_id === newColumnId)
                .sort((a, b) => a.position - b.position);

            // remove from old
            const oldIndex = oldColumnCards.findIndex(
                (c) => c.id === activeCardId
            );
            if (oldIndex !== -1) oldColumnCards.splice(oldIndex, 1);

            // compute insertion index in newColumn
            let insertIndex = newColumnCards.length; // default append
            if (overData?.type === "card") {
                // nếu over là card => chèn trước over card
                const overCardId = (overData.data as ICard).id;
                const idx = newColumnCards.findIndex(
                    (c) => c.id === overCardId
                );
                if (idx !== -1) insertIndex = idx;
            } else {
                // nếu over là column (thả vào cuối) -> append
                insertIndex = newColumnCards.length;
            }

            // Insert activeCard into newColumnCards at insertIndex with updated column_id
            const movedCard = { ...activeCard, column_id: newColumnId };
            newColumnCards.splice(insertIndex, 0, movedCard);

            // Rebuild positions
            const updatedOldCol = oldColumnCards.map((c, i) => ({
                ...c,
                position: i + 1,
            }));
            const updatedNewCol = newColumnCards.map((c, i) => ({
                ...c,
                position: i + 1,
            }));

            // Build new local cards array
            const otherCards = localCards.filter(
                (c) =>
                    c.column_id !== oldColumnId && c.column_id !== newColumnId
            );
            const newLocalCards = [
                ...otherCards,
                ...updatedOldCol,
                ...updatedNewCol,
            ];

            setLocalCards(newLocalCards);

            // Persist to DB: update column_id first, then positions
            try {
                await cardService.updateCard(activeCardId, {
                    column_id: newColumnId,
                });
                await cardService.updateCardPositions([
                    ...updatedOldCol.map((c) => ({
                        id: c.id,
                        position: c.position,
                        column_id: c.column_id,
                    })),
                    ...updatedNewCol.map((c) => ({
                        id: c.id,
                        position: c.position,
                        column_id: c.column_id,
                    })),
                ]);
            } catch (err) {
                console.error("Lỗi update column & position:", err);
                // TODO: rollback nếu cần
            }

            // reset
            setActiveDragType(null);
            setActiveDragColumnData(null);
            setActiveDragCardData(null);
            return;
        }

        // Nếu cùng column => reorder trong column
        if (oldColumnId === newColumnId) {
            // chỉ reorder trong list của column đó
            const columnCards = localCards
                .filter((c) => c.column_id === oldColumnId)
                .sort((a, b) => a.position - b.position);

            const fromIndex = columnCards.findIndex(
                (c) => c.id === activeCardId
            );
            // if over is card => find over index in column
            let toIndex = columnCards.length - 1;
            if (overData?.type === "card") {
                const overCardId = (overData.data as ICard).id;
                toIndex = columnCards.findIndex((c) => c.id === overCardId);
            }

            if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
                const moved = arrayMove(columnCards, fromIndex, toIndex);
                const updated = moved.map((c, i) => ({
                    ...c,
                    position: i + 1,
                }));

                const other = localCards.filter(
                    (c) => c.column_id !== oldColumnId
                );
                const newLocalCards = [...other, ...updated];
                setLocalCards(newLocalCards);

                try {
                    await cardService.updateCardPositions(
                        updated.map((c) => ({
                            id: c.id,
                            position: c.position,
                            column_id: c.column_id,
                        }))
                    );
                } catch (err) {
                    console.error("Lỗi update vị trí:", err);
                }
            }
        }

        // cleanup
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
