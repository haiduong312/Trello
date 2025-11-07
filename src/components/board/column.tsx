"use client";

import { Card, Typography, Button, Popconfirm, Dropdown, message } from "antd";
import { CloseOutlined, EllipsisOutlined } from "@ant-design/icons";
import { useCardsByColumnId } from "@/libs/react-query/query/card.query";
import { useEffect, useRef, useState } from "react";
import "@/components/styles/board.style.scss";
import { useCreateCards } from "@/libs/react-query/mutation/card.mutation";
import type { MenuProps } from "antd";
import { useDeleteColumn } from "@/libs/react-query/mutation/column.mutation";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import CardItem from "./card";
interface IProps {
  col: IColumn;
  activeAddCardColumnId: string | null;
  setActiveAddCardColumnId: (v: string | null) => void;
  activeDragType: "column" | "card" | null;
}

const Column = ({
  col,
  activeAddCardColumnId,
  setActiveAddCardColumnId,
  activeDragType,
}: IProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: col.id, data: { ...col, type: "column" } });

  const style = {
    touchAction: "none",
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };
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
  const { Title, Text } = Typography;
  const { data: cards } = useCardsByColumnId(col.id);
  const [cardTitle, setCardTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { mutate: createCard } = useCreateCards();
  const { mutate: deleteColumn } = useDeleteColumn();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [localCards, setLocalCards] = useState<ICard[]>(cards || []);

  useEffect(() => {
    if (cards) setLocalCards(cards);
  }, [cards]);
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
      setCardTitle("");
      setActiveAddCardColumnId(null);
    } catch (err) {
      console.error("Add card failed:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleClickAddCard = () => {
    setActiveAddCardColumnId(col.id);
  };
  useEffect(() => {
    if (activeAddCardColumnId === col.id && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeAddCardColumnId, col.id]);
  const handleDeleteColumn = (columnId: string) => {
    deleteColumn(columnId, {
      onSuccess: () => {
        message.success("Delete column successfully 🎉");
      },
      onError: () => {
        message.error("Delete column failed");
      },
    });
  };
  const items: MenuProps["items"] = [
    {
      label: (
        <a
          onClick={() => {
            setActiveAddCardColumnId(col.id);
            handleClickAddCard();
          }}
        >
          Add card
        </a>
      ),
      key: "0",
    },
    {
      label: <a onClick={() => handleDeleteColumn(col.id)}>Delete column</a>,
      key: "1",
    },
    {
      label: "3rd menu item",
      key: "3",
    },
  ];
  const handleDragEnd = async (e: DragEndEvent) => {
    console.log(e);
  };
  return (
    <div ref={setNodeRef} style={style}>
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
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          {...attributes}
          {...listeners}
        >
          <Title level={5}>{col.title}</Title>
          <Dropdown menu={{ items }} trigger={["click"]}>
            <EllipsisOutlined style={{ fontSize: 25, marginBottom: 8 }} />
          </Dropdown>
        </div>
        {/* Hiển thị danh sách card */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            maxHeight: 600,
            pointerEvents: activeDragType === "column" ? "none" : "auto",
          }}
        >
          {activeDragType === "column" ? (
            <div>
              {localCards?.map((card) => (
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
              ))}
            </div>
          ) : (
            <SortableContext
              items={cards?.map((card) => card.id) ?? []}
              strategy={verticalListSortingStrategy}
            >
              {cards?.map((card) => (
                <CardItem
                  key={card.id}
                  card={card}
                  activeDragType={activeDragType}
                />
              ))}
            </SortableContext>
          )}
        </div>

        {activeAddCardColumnId === col.id ? (
          <div>
            <Card
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
              <textarea
                ref={inputRef}
                placeholder="Please enter your card's title"
                style={{
                  border: "none",
                  background: "rgb(245 245 245)",
                  outline: "none",
                  width: "100%",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                }}
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                maxLength={255}
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
                  (setActiveAddCardColumnId(null), setCardTitle(""));
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
            onClick={() => setActiveAddCardColumnId(col.id)}
            style={{ height: 38 }}
          >
            + Add a Card
          </Button>
        )}
      </Card>
    </div>
  );
};

export default Column;
