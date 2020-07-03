import React from "react";
import Select from "react-select";
import { useMessageData } from "../MessageBoardContext";
import "bootstrap/dist/css/bootstrap.min.css";

/** Renders the message board text input
 *
 * @returns {React.FunctionComponent}
 */
export const Input = () => {
  const {
    onSendMessage,
    text,
    setText,
    member,
    memberCreation,
    setMemberCreation,
    onUserCreation
  } = useMessageData();
  // Handles text input for username
  const handleUsernameChange = e => {
    const value = e.target.value;
    setMemberCreation({
      ...memberCreation,
      [e.target.name]: value
    });
  };
  // Handles dropdown input for color
  const handleColorChange = e => {
    setMemberCreation({
      ...memberCreation,
      color: e.value
    });
  };
  // Handles text input for messages
  const handleChange = e => {
    setText(e.target.value);
  };
  // Handles user creation
  const handleUserSubmit = e => {
    e.preventDefault();
    onUserCreation(memberCreation);
  };
  // Handles message delivery
  const handleSubmit = e => {
    e.preventDefault();
    onSendMessage({ text, member });
    setText("");
  };
  const colorSelection = [
    { label: "red", value: "red" },
    { label: "green", value: "green" },
    { label: "blue", value: "blue" },
    { label: "purple", value: "purple" }
  ];
  if (member) {
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
  } else {
    return (
      <div className="Input">
        <form onSubmit={handleUserSubmit}>
          <input
            name="username"
            onChange={handleUsernameChange}
            type="text"
            placeholder="Enter your username"
          />
          <div className="container">
            <div className="row">
              <div className="col-md-3"></div>
              <div className="col-md-6">
                <Select
                  onChange={handleColorChange}
                  options={colorSelection}
                  placeholder="Pick avatar color"
                />
              </div>
              <div className="col-md-4"></div>
            </div>
          </div>
          <button>Send</button>
        </form>
      </div>
    );
  }
};
