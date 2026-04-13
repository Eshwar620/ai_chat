import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import API from "../../services/api";

const ChatWindow = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  // Load previous messages
  const fetchMessages = async () => {
    try {
      const res = await API.get(`/chat/${chatId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!chatId) return;

    fetchMessages();

    if (socketRef.current) socketRef.current.close();

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${chatId}`);

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = (event) => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];

        if (last && last.role === "assistant") {
          return [
            ...prev.slice(0, -1),
            { ...last, content: last.content + event.data },
          ];
        }

        return [...prev, { role: "assistant", content: event.data }];
      });

      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 500);
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("🔌 WebSocket closed");
    };

    socketRef.current = ws;

    return () => {
      ws.close();
    };
  }, [chatId]);

  const sendMessage = () => {
    if (!input || socketRef.current?.readyState !== WebSocket.OPEN) return;

    socketRef.current.send(input);

    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
    ]);

    setInput("");
  };

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  if (!chatId) {
    return <div style={styles.empty}>👉 Select a chat</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.messages} ref={scrollRef}>
        <div style={styles.wrapper}>
          {messages.map((msg, i) => (
            <MessageBubble key={i} {...msg} />
          ))}

          {isTyping && (
            <div style={{ color: "#9ca3af", padding: "10px" }}>
              AI is typing...
            </div>
          )}
        </div>
      </div>

      <div style={styles.inputBox}>
        <div style={styles.inputWrapper}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.button}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 0",
  },
  wrapper: {
    maxWidth: "800px",
    margin: "0 auto",
    width: "100%",
  },
  inputBox: {
    borderTop: "1px solid #444",
    padding: "12px",
    background: "#343541",
  },
  inputWrapper: {
    maxWidth: "800px",
    margin: "0 auto",
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    background: "#40414f",
    color: "white",
  },
  button: {
    padding: "12px 18px",
    background: "#10a37f",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
  empty: {
    color: "white",
    padding: "20px",
  },
};

export default ChatWindow;