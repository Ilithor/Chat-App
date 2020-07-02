import React from "react";
import { useMessageData } from "../MessageBoardContext";

/** Renders a message with styles corresponding with who
 *  the message came from.
 *
 * @type {MessageComponentProps}
 * @returns {React.FunctionComponent}
 */
export const Message = ({ currentMember }) => {
  const { messageList } = useMessageData();
  const renderMessage = message => {
    const { member, text } = message;
    const messageFromMe = member.id === currentMember.id;
    const className = messageFromMe
      ? "Messages-message currentMember"
      : "Messages-message";
    return (
      <li className={className} key={member.id}>
        <span
          className="avatar"
          style={{ backgroundColor: member.clientData.color }}
        />
        <div className="Message-content">
          <div className="username">{member.clientData.username}</div>
          <div className="text">{text?.hello || text}</div>
        </div>
      </li>
    );
  };
  return (
    <ul className="Messages-list">{messageList.map(m => renderMessage(m))}</ul>
  );
};

/**
 * @typedef MessageComponentProps
 * @property {object} currentMember
 * @property {string} currentMember.id
 * @property {object} currentMember.clientData
 * @property {number} currentMember.clientData.id
 * @property {string} currentMember.clientData.color
 * @property {string} currentMember.clientData.username
 */
