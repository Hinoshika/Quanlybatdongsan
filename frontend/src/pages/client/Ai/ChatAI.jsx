import React, { useState, useRef, useEffect } from "react";

export default function ChatAI() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "ai",
            text: "Xin chào! Tôi là trợ lý AI của hệ thống quản lý bất động sản. Tôi có thể giúp gì cho bạn?"
        }
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const currentInput = input;

        setMessages(prev => [
            ...prev,
            {
                role: "user",
                text: currentInput
            }
        ]);

        setInput("");
        setLoading(true);

        try {
            const res = await fetch(
                "http://localhost:5000/api/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: currentInput
                    })
                }
            );

            const data = await res.json();

            setMessages(prev => [
                ...prev,
                {
                    role: "ai",
                    text:
                        data.reply ||
                        "Không nhận được phản hồi từ AI."
                }
            ]);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    role: "ai",
                    text:
                        "Không thể kết nối tới máy chủ AI."
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <>
            {/* Nút mở chat */}
            <div
                onClick={() => setOpen(!open)}
                style={{
                    position: "fixed",
                    right: 24,
                    bottom: 24,
                    width: 65,
                    height: 65,
                    borderRadius: "50%",
                    background:
                        "linear-gradient(135deg,#2563eb,#1e40af)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    color: "#fff",
                    fontSize: 28,
                    boxShadow:
                        "0 10px 30px rgba(37,99,235,0.4)",
                    zIndex: 9999,
                    userSelect: "none"
                }}
            >
                💬
            </div>

            {/* Khung chat */}
            {open && (
                <div
                    style={{
                        position: "fixed",
                        right: 24,
                        bottom: 100,
                        width: 380,
                        height: 580,
                        background: "#fff",
                        borderRadius: 20,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow:
                            "0 15px 40px rgba(0,0,0,.18)",
                        zIndex: 9999
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            padding: "15px 18px",
                            background:
                                "linear-gradient(135deg,#2563eb,#1e3a8a)",
                            color: "#fff",
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center"
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    fontSize: 16,
                                    fontWeight: 700
                                }}
                            >
                                🤖 Trợ lý AI Bất Động Sản
                            </div>

                            <div
                                style={{
                                    fontSize: 12,
                                    opacity: 0.9
                                }}
                            >
                                Luôn sẵn sàng hỗ trợ
                            </div>
                        </div>

                        <button
                            onClick={() => setOpen(false)}
                            style={{
                                border: "none",
                                background: "transparent",
                                color: "#fff",
                                cursor: "pointer",
                                fontSize: 20
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            padding: 15,
                            background: "#f8fafc"
                        }}
                    >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        msg.role === "user"
                                            ? "flex-end"
                                            : "flex-start",
                                    marginBottom: 12
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-end",
                                        gap: 8,
                                        maxWidth: "85%"
                                    }}
                                >
                                    {msg.role === "ai" && (
                                        <div
                                            style={{
                                                width: 34,
                                                height: 34,
                                                borderRadius:
                                                    "50%",
                                                background:
                                                    "#2563eb",
                                                color: "#fff",
                                                display: "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                                fontSize: 16
                                            }}
                                        >
                                            🤖
                                        </div>
                                    )}

                                    <div
                                        style={{
                                            padding:
                                                "10px 14px",
                                            borderRadius:
                                                msg.role ===
                                                    "user"
                                                    ? "18px 18px 4px 18px"
                                                    : "18px 18px 18px 4px",
                                            background:
                                                msg.role ===
                                                    "user"
                                                    ? "#2563eb"
                                                    : "#fff",
                                            color:
                                                msg.role ===
                                                    "user"
                                                    ? "#fff"
                                                    : "#111827",
                                            boxShadow:
                                                "0 2px 8px rgba(0,0,0,.08)",
                                            lineHeight:
                                                1.5,
                                            wordBreak:
                                                "break-word"
                                        }}
                                    >
                                        {msg.text}
                                    </div>

                                    {msg.role ===
                                        "user" && (
                                            <div
                                                style={{
                                                    width: 34,
                                                    height: 34,
                                                    borderRadius:
                                                        "50%",
                                                    background:
                                                        "#0f172a",
                                                    color: "#fff",
                                                    display: "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center"
                                                }}
                                            >
                                                👤
                                            </div>
                                        )}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    gap: 10
                                }}
                            >
                                <div
                                    style={{
                                        width: 34,
                                        height: 34,
                                        borderRadius:
                                            "50%",
                                        background:
                                            "#2563eb",
                                        color: "#fff",
                                        display: "flex",
                                        justifyContent:
                                            "center",
                                        alignItems:
                                            "center"
                                    }}
                                >
                                    🤖
                                </div>

                                <div
                                    style={{
                                        background:
                                            "#fff",
                                        padding:
                                            "10px 14px",
                                        borderRadius:
                                            16,
                                        boxShadow:
                                            "0 2px 8px rgba(0,0,0,.08)"
                                    }}
                                >
                                    AI đang trả lời...
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div
                        style={{
                            padding: 12,
                            borderTop:
                                "1px solid #e5e7eb",
                            display: "flex",
                            gap: 10,
                            background: "#fff"
                        }}
                    >
                        <input
                            value={input}
                            onChange={(e) =>
                                setInput(
                                    e.target.value
                                )
                            }
                            onKeyDown={
                                handleKeyDown
                            }
                            placeholder="Nhập câu hỏi..."
                            style={{
                                flex: 1,
                                border:
                                    "1px solid #d1d5db",
                                borderRadius: 12,
                                padding:
                                    "12px 14px",
                                outline: "none"
                            }}
                        />

                        <button
                            onClick={sendMessage}
                            disabled={loading}
                            style={{
                                border: "none",
                                background:
                                    "#2563eb",
                                color: "#fff",
                                padding:
                                    "0 18px",
                                borderRadius: 12,
                                cursor: "pointer",
                                fontWeight: 600
                            }}
                        >
                            Gửi
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}