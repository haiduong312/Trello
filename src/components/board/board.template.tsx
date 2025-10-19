"use client";

import { useBoardId } from "@/libs/react-query/query/board.query";
import { useColumnById } from "@/libs/react-query/query/column.query";
import { usePathname } from "next/navigation";
import { Button } from "antd";
import { useState } from "react";
import "@/components/styles/board.style.scss";
import BoardHeader from "../header/board.header";
import React from "react";
import type { PopconfirmProps } from "antd";
import { useDeleteColumn } from "@/libs/react-query/mutation/column.mutation";
import { useCreateCards } from "@/libs/react-query/mutation/card.mutation";
import CardColumn from "./card.column";

const BoardTemplate = () => {
  const currentPathName = usePathname();
  const pathName = currentPathName.split("/board/")[1];
  const { data: columns } = useColumnById(pathName);
  const { data: board, isLoading } = useBoardId(pathName);
  const [activeAddCardColumnId, setActiveAddCardColumnId] = useState<
    string | null
  >(null);
  const { mutate: deleteColumn } = useDeleteColumn();
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

  if (isLoading || !board) {
    return <div>Loading...</div>;
  }

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
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
      <div>
        <BoardHeader name={board.title} />
      </div>
      <div className="column-container">
        {columns?.map((col) => (
          <CardColumn
            key={col.id}
            col={col}
            deleteColumn={deleteColumn}
            handleCardOk={handleCardOk}
            activeAddCardColumnId={activeAddCardColumnId}
            setActiveAddCardColumnId={setActiveAddCardColumnId}
          />
        ))}

        <div style={{ marginTop: 0 }}>
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
          >
            + Add another column
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BoardTemplate;
