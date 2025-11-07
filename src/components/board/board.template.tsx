"use client";

import { useBoardId } from "@/libs/react-query/query/board.query";
import { useColumnById } from "@/libs/react-query/query/column.query";
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
  // PointerSensor,
  useSensor,
  MouseSensor,
  TouchSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { columnService } from "@/libs/services";
import Column from "./column";
import CardItem from "./card";
import { useCardsByBoardId } from "@/libs/react-query/query/card.query";

const BoardTemplate = () => {
  // const pointerSensor = useSensor(PointerSensor, {
  //     activationConstraint: { distance: 10 },
  // });
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 200, tolerance: 5 },
  });

  // ưu tiên sử dụng 2 loại sensors (mouse, touch) để có trải nghiệm mobile tốt nhất, tránh bị bug
  const sensors = useSensors(mouseSensor, touchSensor);
  const currentPathName = usePathname();
  const pathName = currentPathName.split("/board/")[1];
  const { data: columns } = useColumnById(pathName);
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
  const handleDragStart = (e: DragEndEvent) => {
    const type = e.active.data.current?.type;
    setActiveDragType(type || null);
    if (e.active.data.current) {
      setActiveDragColumnData(e.active.data.current as IColumn);
      setActiveDragCardData(e.active.data.current as ICard);
    } else {
      setActiveDragColumnData(null);
    }
  };
  const handleDragEnd = async (e: DragEndEvent) => {
    console.log(e);
    const { active, over } = e;
    if (!over) return;
    if (activeDragType === "column") {
      if (active?.id !== over?.id) {
        // Lấy vị trí cũ từ active
        const oldIndex = localColumns.findIndex((c) => c.id === active.id);

        // Lấy vị trí mới từ active
        const newIndex = localColumns.findIndex((c) => c.id === over?.id);

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
          // rollback UI nếu cần
          setLocalColumns(localColumns);
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
  return (
    <DndContext
      onDragEnd={handleDragEnd}
      sensors={sensors}
      onDragStart={handleDragStart}
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
                  cards={localCards.filter((card) => card.column_id === col.id)}
                  activeAddCardColumnId={activeAddCardColumnId}
                  setActiveAddCardColumnId={setActiveAddCardColumnId}
                  activeDragType={activeDragType}
                />
              ))}
              <DragOverlay dropAnimation={dropAnimation}>
                {activeDragType === "column" && activeDragColumnData && (
                  <Column
                    col={activeDragColumnData}
                    activeAddCardColumnId={null}
                    setActiveAddCardColumnId={() => {}}
                    activeDragType="column"
                    cards={localCards.filter(
                      (card) => card.column_id === activeDragColumnData.id
                    )}
                  />
                )}
                {activeDragType === "card" && activeDragCardData && (
                  <CardItem card={activeDragCardData} activeDragType="card" />
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
                        onChange={(e) => setColumnTitle(e.target.value)}
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
                          (setActiveAddColumn(false), setColumnTitle(""));
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
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default BoardTemplate;
