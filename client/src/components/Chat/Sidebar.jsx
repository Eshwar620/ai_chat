import { useEffect, useState } from "react";
import API from "../../services/api";

const Sidebar = ({ setChatId, chatId }) => {
  const [chats, setChats] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
  setToast({ message, type });

  setTimeout(() => {
    setToast(null);
  }, 2000);
};

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
  fetchChats();

  const interval = setInterval(fetchChats, 2000); // 🔥 auto refresh

  return () => clearInterval(interval);
}, []);

  const fetchChats = async () => {
  try {
    const res = await API.get("/chat/");
    setChats(res.data);
  } catch (err) {
    console.error(err);
  }
};

  const createChat = async () => {
  try {
    const res = await API.post("/chat/create");

    const newChatId = res.data.chat_id || res.data.id;

    setChatId(newChatId);

    showToast("Start typing to name your chat", "success");

    fetchChats();
  } catch (err) {
    console.error(err);
    showToast("Failed to create chat", "error");
  }
};

  // 🗑 DELETE CHAT
  const deleteChat = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this chat?");
  if (!confirmDelete) return;

  try {
    await API.delete(`/chat/${id}`);
    fetchChats();

    showToast("Chat deleted successfully", "success");
  } catch (err) {
    console.error("❌ Delete error:", err);
    showToast("Failed to delete chat", "error");
  }
};

  // ✏️ RENAME CHAT
  const renameChat = async (id) => {
    const newTitle = prompt("Enter new chat title:");
    if (!newTitle) return;

    try {
      await API.put(`/chat/${id}`, { title: newTitle });
      fetchChats();
      console.log("✏️ Chat renamed");
    } catch (err) {
      console.error("❌ Rename error:", err);
    }
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>AI Chat</h2>

      <button style={styles.button} onClick={createChat}>
        + New Chat
      </button>

      <div style={styles.chatList}>
        {chats.map((chat) => (
          <div
            key={chat.id}
            style={{
              ...styles.chatItem,
              background: chat.id === chatId ? "#1e293b" : "transparent",
              justifyContent: "space-between",
            }}
            onMouseEnter={(e) => {
              if (chat.id !== chatId)
                e.currentTarget.style.background = "#1e293b";
            }}
            onMouseLeave={(e) => {
              if (chat.id !== chatId)
                e.currentTarget.style.background = "transparent";
            }}
          >
            {/* 👇 CHAT TITLE CLICK */}
            <span
              style={{ flex: 1 }}
              onClick={() => setChatId(chat.id)}
            >
              💬 {chat.title || "New Chat"}
            </span>

            {/* 🔥 ACTION ICONS */}
            <div style={{ display: "flex", gap: "8px" }}>
              <span
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation(); // ❗ important
                  deleteChat(chat.id);
                }}
              >
                🗑
              </span>

              <span
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation(); // ❗ important
                  renameChat(chat.id);
                }}
              >
                ✏️
              </span>
            </div>
          </div>
        ))}
      </div>
      {toast && (
  <div
    style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: toast.type === "success" ? "#16a34a" : "#dc2626",
      color: "white",
      padding: "12px 16px",
      borderRadius: "8px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      zIndex: 1000,
    }}
  >
    {toast.message}
  </div>
)}
    </div>
  );
};

const styles = {
  sidebar: {
    height: "100%",   // 🔥 IMPORTANT FIX
    overflowY: "auto",
    padding: "16px",
  },
  title: {
    fontSize: "18px",
    marginBottom: "15px",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#111827",
    border: "1px solid #374151",
    color: "white",
    cursor: "pointer",
    borderRadius: "8px",
    marginBottom: "15px",
    transition: "0.2s",
  },
  chatList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  chatItem: {
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "0.2s",
  },
};

export default Sidebar;