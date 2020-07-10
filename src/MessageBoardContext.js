import React, { createContext, useContext, useState, useEffect } from "react";
import _ from "lodash";
/** @type {React.Context<MessageBoardContextProps>} */
const messageBoardContext = createContext();

/**
 * @typedef MessageBoardContextProps
 * @property {message[]} messageList
 * @property {React.Dispatch<React.SetStateAction<message[]>>} setMessageList
 * @property {()=>void} onUserCreation
 * @property {member} memberCreation
 * @property {React.Dispatch<React.SetStateAction<member>>} setMemberCreation
 * @property {boolean} isMember
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsMember
 * @property {member} member
 * @property {React.Dispatch<React.SetStateAction<member>>} setMember
 * @property {member[]} memberList
 * @property {React.Dispatch<React.SetStateAction<member[]>>} setMemberList
 * @property {string} text
 * @property {React.Dispatch<React.SetStateAction<string>>} setText
 * @property {any} drone
 * @property {React.Dispatch<React.SetStateAction<any>>} setDrone
 * @property {boolean} isDrone
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsDrone
 * @property {any} room
 * @property {React.Dispatch<React.SetStateAction<any>>} setRoom
 * @property {boolean} isRoom
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsRoom
 * @property {()=>void} onSendMessage
 */

/** Handles message and member state data
 *
 * @type {IMessageBoardProviderComponentProps}
 * @returns {React.FunctionComponent}
 */
export const MessageBoardProvider = ({ children }) => {
  // Handles the messageList state
  const [messageList, setMessageList] = useState([]);
  /** Handles creating a new user
   *
   * @param {newMemberData} inputData
   * @returns {void}
   */
  const onUserCreation = inputData => {
    setMember({
      username: inputData?.username,
      color: inputData?.color
    });
    setIsMember(true);
  };
  // Handles user creation state
  const [memberCreation, setMemberCreation] = useState();
  // Handles member exists state
  const [isMember, setIsMember] = useState(false);
  // Handles the current user info
  const [member, setMember] = useState();
  // Handles the user list
  const [memberList, setMemberList] = useState([]);
  // Handles the current message to be sent
  const [text, setText] = useState("");
  // Handles the drone object
  const [drone, setDrone] = useState();
  // Handles drone exists state
  const [isDrone, setisDrone] = useState(false);
  // Handles the room object
  const [room, setRoom] = useState();
  // Handles the room exists state
  const [isRoom, setIsRoom] = useState(false);

  /** Handles adding new message the room
   *
   * @param {newMessageData} messageData
   * @returns {void}
   */
  const onSendMessage = messageData => {
    const { text, member } = messageData;
    drone.publish({
      room: "observable-gonk",
      message: {
        username: member?.username,
        color: member?.color,
        message: text,
        timestamp: Date.now()
      }
    });
  };
  // Passes user into the drone
  useEffect(() => {
    if (member) {
      setDrone(
        new window.Scaledrone("7A27xHoFszEaNml9", {
          data: member
        })
      );
      setisDrone(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMember]);
  /**
   * Initializes drone connection and sets clientId to user,
   * then subscribes to the room.
   */
  useEffect(() => {
    if (drone) {
      drone.on("open", err => {
        if (err) {
          return console.error(err);
        }
        const data = { ...member };
        data.id = drone.clientId;
        setMember(data);
      });
      setRoom(
        drone.subscribe("observable-gonk", {
          historyCount: 10
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrone]);
  // Initializes the connection to the room
  useEffect(() => {
    if (room) {
      room.on("open", err => {
        if (err) {
          return console.error(err);
        }
      });
      setIsRoom(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);
  // Receives new messages from the room, and adds it to the messageList
  useEffect(() => {
    if (room) {
      room.on("members", m => {
        const temp = [];
        _.map(m, member => [temp.push(member?.clientData?.username)]);
        setMemberList(temp);
      });
      room.on("message", message => {
        const { data, member, id } = message;
        setMessageList([
          ...messageList,
          {
            member,
            text: data?.message,
            timestamp: data?.timestamp,
            id
          }
        ]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, messageList]);
  if (room) {
    room.on("member_join", m => {
      const updatedMemberList = [...memberList];
      updatedMemberList.push(m?.clientData?.username);
      setMemberList(updatedMemberList);
    });
  }
  if (room) {
    room.on("member_leave", ({ id }) => {
      const updatedMemberList = [...memberList];
      const index = memberList.findIndex(member => member?.id === id);
      updatedMemberList.splice(index, 1);
      setMemberList(updatedMemberList);
    });
  }

  // Pulls message history from the room and adds it to the messageList
  useEffect(() => {
    if (isRoom) {
      const history = [];
      room.on("history_message", message => {
        const { data, clientId, id } = message;
        const converted = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }).format(data?.timestamp);
        history.push({
          member: {
            clientData: { username: data?.username, color: data?.color },
            id: clientId
          },
          text: data?.message,
          id,
          timestamp: converted
        });
        setMessageList([...history]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRoom]);

  const value = {
    messageList,
    member,
    setMember,
    onSendMessage,
    text,
    setText,
    memberCreation,
    setMemberCreation,
    onUserCreation,
    memberList
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
 * @typedef newMemberData
 * @property {string} username
 * @property {string} color
 */

/**
 * @typedef IMessageBoardComponentProps
 * @property {React.ReactChild} children
 */

/**
 * @typedef newMessageData
 * @property {object} member
 * @property {string} member.username
 * @property {string} member.color
 * @property {string} text
 */

/**
 * @typedef MessageBoardData
 * @property {message[]} [messageList]
 * @property {member} [member]
 * @property {React.Dispatch<React.SetStateAction<member>>} setMember
 * @property {()=>void} [onSendMessage]
 * @property {string} [text]
 * @property {React.Dispatch<React.SetStateAction<string>>} [setText]
 * @property {member} [memberCreation]
 * @property {React.Dispatch<React.SetStateAction<member>>} [setMemberCreation]
 * @property {()=>void} [onUserCreation]
 */
