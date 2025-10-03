"use client";

import { Card } from "antd";
import "@/components/styles/mostpopular.scss";
import Image from "next/image";
const MostPopularTemplate = () => {
    const { Meta } = Card;
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <h2 style={{ fontSize: 19, marginBottom: 20 }}>
                    Most popular templates
                </h2>
            </div>
            <div style={{ display: "flex", gap: 50 }}>
                <Card
                    hoverable
                    style={{ height: 108, width: 215, textAlign: "center" }}
                    styles={{
                        body: {
                            padding: 0,
                            paddingTop: 5,
                        },
                    }}
                    cover={
                        <Image
                            draggable={false}
                            alt="example"
                            src="/assets/water.jpg"
                            width={215}
                            height={72}
                        />
                    }
                >
                    <Meta
                        title={
                            <span style={{ fontWeight: 400, fontSize: 15 }}>
                                KanBan Template
                            </span>
                        }
                    />
                </Card>
                <Card
                    hoverable
                    style={{ height: 108, width: 215, textAlign: "center" }}
                    styles={{
                        body: {
                            padding: 0,
                            paddingTop: 5,
                        },
                    }}
                    cover={
                        <Image
                            draggable={false}
                            alt="example"
                            src="/assets/blue-mountain.jpg"
                            width={215}
                            height={72}
                        />
                    }
                >
                    <Meta
                        title={
                            <span style={{ fontWeight: 400, fontSize: 15 }}>
                                WorkSpaces Template
                            </span>
                        }
                    />
                </Card>
                <Card
                    hoverable
                    style={{ height: 108, width: 215, textAlign: "center" }}
                    styles={{
                        body: {
                            padding: 0,
                            paddingTop: 5,
                        },
                    }}
                    cover={
                        <Image
                            draggable={false}
                            alt="example"
                            src="/assets/yel-mountain.jpg"
                            width={215}
                            height={72}
                        />
                    }
                >
                    <Meta
                        title={
                            <span style={{ fontWeight: 400, fontSize: 15 }}>
                                Trello Template
                            </span>
                        }
                    />
                </Card>
            </div>
        </div>
    );
};
export default MostPopularTemplate;
