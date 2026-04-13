import ReactMarkdown from "react-markdown";

const MessageBubble = ({ role, content, created_at }) => {
  const isUser = role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          padding: "14px 16px",
          borderRadius: "10px",
          background: isUser ? "#10a37f" : "#444654",
          color: "white",
        }}
      >
        <ReactMarkdown>{content}</ReactMarkdown>

        <div style={{ fontSize: "10px", opacity: 0.6 }}>
          {created_at
            ? new Date(created_at).toLocaleTimeString()
            : ""}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;