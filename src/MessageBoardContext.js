import React, { createContext, useContext, useState } from "react";
/** @type {React.Context<MessageBoardContextProps>} */
const messageBoardContext = createContext();

/**
 * @typedef MessageBoardContextProps
 * @property {message[]} messageList
 * @property {React.Dispatch<React.SetStateAction<message[]>>} setMessageList
 * @property {member} member
 * @property {React.Dispatch<React.SetStateAction<member>>} setMember
 * @property {string} text
 * @property {React.Dispatch<React.SetStateAction<string>>} setText
 * @property {()=>void} onSendMessage
 */

/** Handles message and member state data
 *
 * @type {IMessageBoardProviderComponentProps}
 * @returns {React.FunctionComponent}
 */
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

  /** Handles adding new message to list
   *
   * @param {string} message
   * @returns {void}
   */
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

/** Hook that returns state
 *
 * @type {()=>MessageBoardData}
 */
export const useMessageData = () => {
  const ctx = useContext(messageBoardContext);
  if (ctx === undefined) {
    throw new Error(
      "useMessageData must be used within a MessageBoard Provider"
    );
  }
  return ctx;
};

/**
 * @typedef message
 * @property {string} text
 * @property {member} member
 */

/**
 * @typedef member
 * @property {string} color
 * @property {string} username
 * @property {number} id
 */

/**
 * @typedef IMessageBoardComponentProps
 * @property {React.ReactChild} children
 */

/**
 * @typedef MessageBoardData
 * @property {message[]} [messagelist]
 * @property {member} [member]
 * @property {()=>void} [onSendMessage]
 * @property {string} [text]
 * @property {React.Dispatch<React.SetStateAction<string>>} [setText]
 */
