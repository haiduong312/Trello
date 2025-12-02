"use client";
import { Dropdown, Input, Avatar, Divider } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import "@/components/styles/header.style.scss";
import { useEffect, useState } from "react";
import { useMostPopularBoard } from "@/libs/react-query/query/board.query";
import { BeatLoader } from "react-spinners";

export default function TrelloSearch() {
    const { data: mostPopularBoards } = useMostPopularBoard();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [originalData, setOriginalData] = useState<any[]>([]);
    const [results, setResults] = useState<any[]>([]);
    const [debouncedValue, setDebouncedValue] = useState(value);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), 300); // đợi 300ms
        return () => clearTimeout(timer);
    }, [value]);

    useEffect(() => {
        if (!debouncedValue) return;

        const fetchBoards = async () => {
            setIsLoading(true);
            const res = await fetch(
                `/api/boards?value=${encodeURIComponent(debouncedValue)}`
            );
            const data = await res.json();
            setOriginalData(data);
            setResults(data);
            setIsLoading(false);
        };
        fetchBoards();
    }, [debouncedValue]);

    const handleSearch = (text: string) => {
        setValue(text);

        const filtered = originalData.filter((item) =>
            item.title.toLowerCase().includes(text.toLowerCase())
        );
        setResults(filtered);
    };
    const overlay = (
        <div
            style={{
                width: 780,
                padding: "10px 0 0 0",
                background: "#fff",
                borderRadius: 8,
                boxShadow:
                    "0 4px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)",
            }}
        >
            {/* Header */}
            <div
                style={{
                    fontSize: 14,
                    fontWeight: 600,
                    padding: "10px 16px",
                }}
            >
                RECENT BOARDS
            </div>

            {/* Items */}
            <div>
                {mostPopularBoards &&
                    value === "" &&
                    mostPopularBoards.map((item, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "10px 16px",
                                cursor: "pointer",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "#f5f6f8")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                    "transparent")
                            }
                        >
                            <Avatar
                                shape="square"
                                size={42}
                                src={item.backgroundUrl}
                                style={{
                                    marginRight: 14,
                                    borderRadius: 6,
                                }}
                            />

                            <div>
                                <div
                                    style={{
                                        fontWeight: 500,
                                        fontSize: 15,
                                    }}
                                >
                                    {item.title}
                                </div>
                                <div
                                    style={{
                                        fontSize: 13,
                                        color: "#666",
                                    }}
                                >
                                    Most Popular Templates
                                </div>
                            </div>
                        </div>
                    ))}
                {results &&
                    value !== "" &&
                    (isLoading ? (
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "rgba(255, 255, 255, 0.6)", // mờ nhẹ
                                zIndex: 1000,
                            }}
                        >
                            <BeatLoader color="#1890ff" size={15} margin={5} />
                        </div>
                    ) : (
                        results.map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "10px 16px",
                                    cursor: "pointer",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                        "#f5f6f8")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                        "transparent")
                                }
                            >
                                <Avatar
                                    shape="square"
                                    size={42}
                                    src={item.backgroundUrl}
                                    style={{
                                        marginRight: 14,
                                        borderRadius: 6,
                                    }}
                                />

                                <div>
                                    <div
                                        style={{
                                            fontWeight: 500,
                                            fontSize: 15,
                                        }}
                                    >
                                        {item.title}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 13,
                                            color: "#666",
                                        }}
                                    >
                                        Most Popular Templates
                                    </div>
                                </div>
                            </div>
                        ))
                    ))}
            </div>

            <Divider style={{ margin: "0" }} />

            {/* Bottom action */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                }}
            >
                <div
                    style={{
                        color: "#1677ff",
                        cursor: "pointer",
                        fontSize: 14,
                    }}
                >
                    Advanced search
                </div>

                <ReloadOutlined
                    style={{
                        fontSize: 18,
                        color: "#999",
                        cursor: "pointer",
                    }}
                />
            </div>
        </div>
    );

    return (
        <Dropdown
            open={open}
            onOpenChange={(val) => {
                setOpen(val);
                if (!val) {
                    setValue("");
                    setDebouncedValue("");
                    setResults([]);
                    setOriginalData([]);
                    setIsLoading(false);
                }
            }}
            trigger={["click"]}
            popupRender={() => overlay}
        >
            <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                style={{ width: "780px" }}
                className="trello-input"
                onClick={() => setOpen(true)}
                value={value}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </Dropdown>
    );
}
