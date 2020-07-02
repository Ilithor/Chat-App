import React, { useState } from "react";
import "./App.css";
import { Message } from "./components/Message";
export const App = () => {
  const [messageList, setMessageList] = useState([
    {
      text: "This is a test message!",
      member: {
        color: "blue",
        username: "bluemoon"
      }
    }
  ]);
  const [member, setMember] = useState({
    username: "greenlake",
    color: "green"
  });
  return (
    <div className="App">
      <Message messageList={messageList} currentMember={member} />
    </div>
  );
};
