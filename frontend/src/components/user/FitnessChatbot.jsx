import { faDumbbell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Box,
    CircularProgress,
    IconButton,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
// import {baseURL} from "../../services/api";

const API_URL = `http://52.62.38.76:3000/api/chatbot/generate`;

export default function FitnessChatbot() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        { from: "bot", text: "👋 Hi! Ask me about diet or workouts." }
    ]);
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!message.trim() || loading) return;

        const userMessage = message.trim();

        // Add user message instantly
        setMessages((prev) => [
            ...prev,
            { from: "user", text: userMessage }
        ]);

        setMessage("");
        setLoading(true);

        try {
            const res = await axios.post(API_URL, {
                message: userMessage
            });

            setMessages((prev) => [
                ...prev,
                { from: "bot", text: res.data.reply || "No response received." }
            ]);
        } catch (error) {
            console.error("Chat Error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    from: "bot",
                    text: "⚠️ Server error. Please try again later."
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* CHAT WINDOW */}
            {open && (
                <ClickAwayListener onClickAway={() => setOpen(false)}>
                    <Paper
                        elevation={10}
                        sx={{
                            position: "fixed",
                            bottom: 10,
                            right: 100,
                            width: 1000,
                            height: 540,
                            borderRadius: 3,
                            display: "flex",
                            flexDirection: "column",
                            zIndex: 99999
                        }}
                    >
                        {/* HEADER */}
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: "#000",
                                color: "#fff",
                                borderTopLeftRadius: 12,
                                borderTopRightRadius: 12
                            }}
                        >
                            <Typography variant="h6">
                                RR Fitness Bot 💪
                            </Typography>
                            <Typography variant="caption">
                                Diet & Workout Assistant
                            </Typography>
                        </Box>

                        {/* MESSAGES */}
                        <Box
                            sx={{
                                flex: 1,
                                p: 2,
                                bgcolor: "#f5f5f5",
                                overflowY: "auto"
                            }}
                        >
                            {messages.map((msg, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        justifyContent:
                                            msg.from === "user"
                                                ? "flex-end"
                                                : "flex-start",
                                        mb: 1
                                    }}
                                >
                                    <Box
                                        sx={{
                                            px: 2,
                                            py: 1,
                                            borderRadius: 2,
                                            maxWidth: "75%",
                                            bgcolor:
                                                msg.from === "user"
                                                    ? "#000"
                                                    : "#e0e0e0",
                                            color:
                                                msg.from === "user"
                                                    ? "#fff"
                                                    : "#000",
                                            fontSize: 14,
                                            overflowX: "auto",
                                            whiteSpace: "pre-wrap"
                                        }}
                                    >
                                        {msg.from === "user" ? (
                                            msg.text
                                        ) : (
                                            <ReactMarkdown>
                                                {msg.text}
                                            </ReactMarkdown>
                                        )}
                                    </Box>
                                </Box>
                            ))}

                            {loading && (
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    mt={1}
                                >
                                    <CircularProgress size={20} />
                                </Box>
                            )}

                            <div ref={messagesEndRef} />
                        </Box>

                        {/* INPUT */}
                        <Box sx={{ p: 1 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Type your message..."
                                value={message}
                                disabled={loading}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                            />
                        </Box>
                    </Paper>
                </ClickAwayListener>
            )}

            {/* FLOATING BUTTON */}
            <IconButton
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen(!open);
                }}
                sx={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    width: 64,
                    height: 64,
                    bgcolor: "#000",
                    color: "#fff",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
                    zIndex: 99999,
                    "&:hover": {
                        bgcolor: "#222",
                        transform: "scale(1.05)"
                    }
                }}
            >
                <FontAwesomeIcon icon={faDumbbell} size="lg" />
            </IconButton>
        </>
    );
}