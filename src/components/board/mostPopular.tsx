"use client";

import { Card } from "antd";
import "@/components/styles/mostpopular.scss";
import Image from "next/image";
import { useMostPopularBoard } from "@/libs/react-query/query/board.query";
const MostPopularTemplate = () => {
  const { Meta } = Card;
  const { data: mostPopularBoards } = useMostPopularBoard();
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: 19, marginBottom: 20 }}>
          Most Popular Templates
        </h2>
      </div>
      <div style={{ display: "flex", gap: 50 }}>
        {mostPopularBoards?.map((item, index) => {
          return (
            <Card
              key={index}
              hoverable
              style={{
                height: 113,
                width: 215,
                textAlign: "center",
              }}
              styles={{
                body: {
                  padding: 0,
                  paddingTop: 10,
                },
              }}
              cover={
                <Image
                  draggable={false}
                  alt="template's background"
                  src={item.backgroundUrl}
                  width={215}
                  height={72}
                  priority
                />
              }
            >
              <Meta
                title={
                  <span
                    style={{
                      fontWeight: 500,
                      fontSize: 15,
                    }}
                  >
                    {item.title}
                  </span>
                }
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
};
export default MostPopularTemplate;
