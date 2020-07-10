import React from "react";
import "./App.css";
import { Message } from "./components/Message";
import { Input } from "./components/Input";
import { useMessageData } from "./MessageBoardContext";
import { MemberList } from "./components/MemberList";

/** Renders the application
 *
 * @returns {React.FunctionComponent}
 */
export const App = () => {
  const { member } = useMessageData();
  return (
    <div className="App">
      <div className="App-header">
        <h1>Gonk Communications Relay</h1>
      </div>
      <MemberList />
      <Message currentMember={member} />
      <Input />
    </div>
  );
};
