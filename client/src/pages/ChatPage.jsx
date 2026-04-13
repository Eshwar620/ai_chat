import { useEffect, useState } from "react";
import Sidebar from "../components/Chat/Sidebar";
import ChatWindow from "../components/Chat/ChatWindow";

const ChatPage = () => {
    const [chatId, setChatId] = useState(null);
    const [user, setUser] = useState(null);


    // ✅ Load user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser && storedUser !== "undefined") {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // ✅ Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/";
    };

    return (
        <div style={styles.container}>

            {/* 🔥 Sidebar */}
            <Sidebar setChatId={setChatId} chatId={chatId} />

            {/* 🔥 Chat Area */}
            <div style={styles.chatArea}>

                {/* 🔥 TOP BAR */}
                <div style={styles.topBar}>
                    <div style={styles.userName}>
                        👋 {user?.name || "User"}
                    </div>

                    <button style={styles.logoutBtn} onClick={handleLogout}>
                        Logout
                    </button>
                </div>

                <ChatWindow chatId={chatId} />
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        height: "100vh",
    },
    chatArea: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
    topBar: {
        height: "50px",
        background: "#111827",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        borderBottom: "1px solid #374151",
    },
    logoutBtn: {
        background: "#ef4444",
        border: "none",
        padding: "6px 12px",
        color: "white",
        borderRadius: "6px",
        cursor: "pointer",
    },
    userName: {
        color: "white",
        fontSize: "16px",
        fontWeight: "500",
    },
};

export default ChatPage;