import React from "react";
import { useMessageData } from "../MessageBoardContext";

/** Renders the message board text input
 *
 * @returns {React.FunctionComponent}
 */
export const Input = () => {
  const { onSendMessage, text, setText } = useMessageData();

  const handleChange = e => {
    setText(e.target.value);
  };
  const handleSubmit = e => {
    e.preventDefault();
    setText("");
    onSendMessage(text);
  };
  return (
    <div className="Input">
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          value={text}
          type="text"
          placeholder="Enter your message..."
        />
        <button>Send</button>
      </form>
    </div>
  );
};
