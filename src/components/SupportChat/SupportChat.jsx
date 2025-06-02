import React, { useState } from "react";
import ChatToggleButton from "./ChatToggleButton";
import ChatModal from "./ChatModal";
import "./SupportChat.css";

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      <ChatToggleButton onClick={toggleChat} />
      {isOpen && <ChatModal onClose={toggleChat} />}
    </>
  );
};

export default SupportChat;
