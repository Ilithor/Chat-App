import React from "react";
import "./App.css";
import { Message } from "./components/Message";
import { Input } from "./components/Input";
import { useMessageData } from "./MessageBoardContext";
export const App = () => {
  const { member } = useMessageData();
  return (
    <div className="App">
      <Message currentMember={member} />
      <Input />
    </div>
  );
};
