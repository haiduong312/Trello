"use client";

import { Card } from "antd";
import "@/components/styles/mostpopular.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import { boardService } from "@/libs/services";
const MostPopularTemplate = () => {
  const { Meta } = Card;
  const [mostPopularBoards, setMostPopularBoards] = useState<IBoard[]>();
  useEffect(() => {
    const fetchMostPopularBoard = async () => {
      try {
        const data = await boardService.getMostPopularBoard();
        setMostPopularBoards(data);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };
    fetchMostPopularBoard();
  }, []);
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
