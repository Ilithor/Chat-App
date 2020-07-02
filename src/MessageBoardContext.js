import React, { createContext, useContext, useState } from "react";

const messageBoardContext = createContext();

export const MessageBoardProvider = ({ children }) => {
  const [messageList, setMessageList] = useState([
    {
      text: "This is a test message!",
      member: {
        color: "blue",
        username: "bluemoon",
        id: 1
      }
    }
  ]);
  const [member, setMember] = useState({
    username: "greenlake",
    color: "green",
    id: 2
  });
  const [text, setText] = useState("");

  const onSendMessage = message => {
    setMessageList([...messageList, { text: message, member: member }]);
  };

  const value = {
    messageList,
    member,
    onSendMessage,
    text,
    setText
  };

  return (
    <messageBoardContext.Provider value={value}>
      {children}
    </messageBoardContext.Provider>
  );
};

export const useMessageData = () => {
  const ctx = useContext(messageBoardContext);
  if (ctx === undefined) {
    throw new Error(
      "useMessageData must be used within a MessageBoard Provider"
    );
  }
  return ctx;
};
