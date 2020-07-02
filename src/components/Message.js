import React from "react";

/** Renders a message with styles corresponding with who
 *  the message came from.
 *
 * @param {object[]} messageList
 * @param {any} currentMember
 * @returns {React.FunctionComponent}
 */
export const Message = (messageList, currentMember) => {
  const renderMessage = message => {
    const { member, text } = message;
    const messageFromMe = member.id === currentMember.id;
    const className = messageFromMe
      ? "Messages-message currentMember"
      : "Messages-message";
    return (
      <li className={className}>
        <span
          className="avatar"
          style={{ backgroundColor: member.clientData.color }}
        />
        <div className="Message-content">
          <div className="username">{member.clientData.username}</div>
          <div className="text">{text}</div>
        </div>
      </li>
    );
  };
  return (
    <ul className="Messages-list">{messageList.map(m => renderMessage(m))}</ul>
  );
};
