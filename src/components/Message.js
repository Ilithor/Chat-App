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
    console.log(member.id, currentMember.id);
    const messageFromMe = member.id === currentMember.id;
    const className = messageFromMe
      ? "Messages-message currentMember"
      : "Messages-message";
    return (
      <li className={className}>
        <span className="avatar" style={{ backgroundColor: member.color }} />
        <div className="Message-content">
          <div className="username">{member.username}</div>
          <div className="text">{text}</div>
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
 * @property {number} currentMember.id
 * @property {string} currentMember.color
 * @property {string} currentMember.username
 */
