import React, { useState } from "react";

const ChatModal = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botReply = { sender: "bot", text: data.reply };
      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Сталася помилка. Спробуйте ще раз." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support-chat-modal">
      <div className="support-chat-header">
        🛠 Техпідтримка
        <button onClick={onClose} className="support-chat-close">✕</button>
      </div>

      <div className="support-chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <div className="message-bubble">{msg.text}</div>
          </div>
        ))}
        {loading && <div className="loading">Підтримка друкує...</div>}
      </div>

      <div className="support-chat-input">
        <input
          type="text"
          placeholder="Ваше питання..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
};

export default ChatModal;
