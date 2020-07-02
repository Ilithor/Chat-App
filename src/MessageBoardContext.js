import React, { createContext, useContext, useState, useEffect } from "react";
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
  const [messageList, setMessageList] = useState([]);
  const randomName = () => {
    const adjectives = [
      "autumn",
      "hidden",
      "bitter",
      "misty",
      "silent",
      "empty",
      "dry",
      "dark",
      "summer",
      "icy",
      "delicate",
      "quiet",
      "white",
      "cool",
      "spring",
      "winter",
      "patient",
      "twilight",
      "dawn",
      "crimson",
      "wispy",
      "weathered",
      "blue",
      "billowing",
      "broken",
      "cold",
      "damp",
      "falling",
      "frosty",
      "green",
      "long",
      "late",
      "lingering",
      "bold",
      "little",
      "morning",
      "muddy",
      "old",
      "red",
      "rough",
      "still",
      "small",
      "sparkling",
      "throbbing",
      "shy",
      "wandering",
      "withered",
      "wild",
      "black",
      "young",
      "holy",
      "solitary",
      "fragrant",
      "aged",
      "snowy",
      "proud",
      "floral",
      "restless",
      "divine",
      "polished",
      "ancient",
      "purple",
      "lively",
      "nameless"
    ];
    const nouns = [
      "waterfall",
      "river",
      "breeze",
      "moon",
      "rain",
      "wind",
      "sea",
      "morning",
      "snow",
      "lake",
      "sunset",
      "pine",
      "shadow",
      "leaf",
      "dawn",
      "glitter",
      "forest",
      "hill",
      "cloud",
      "meadow",
      "sun",
      "glade",
      "bird",
      "brook",
      "butterfly",
      "bush",
      "dew",
      "dust",
      "field",
      "fire",
      "flower",
      "firefly",
      "feather",
      "grass",
      "haze",
      "mountain",
      "night",
      "pond",
      "darkness",
      "snowflake",
      "silence",
      "sound",
      "sky",
      "shape",
      "surf",
      "thunder",
      "violet",
      "water",
      "wildflower",
      "wave",
      "water",
      "resonance",
      "sun",
      "wood",
      "dream",
      "cherry",
      "tree",
      "fog",
      "frost",
      "voice",
      "paper",
      "frog",
      "smoke",
      "star"
    ];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return adjective + noun;
  };

  const randomColor = () => {
    return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
  };

  const [member, setMember] = useState({
    username: randomName(),
    color: randomColor()
  });
  const [text, setText] = useState("");
  const [drone, setDrone] = useState();
  const [room, setRoom] = useState();
  const [isRoom, setIsRoom] = useState(false);

  /** Handles adding new message to list
   *
   * @param {object} message
   * @returns {void}
   */
  const onSendMessage = message => {
    drone.publish({
      room: "observable-gonk",
      message
    });
  };
  useEffect(() => {
    setDrone(
      new window.Scaledrone("7A27xHoFszEaNml9", {
        data: member
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
          historyCount: 5
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drone]);

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

  useEffect(() => {
    if (room) {
      room.on("message", message => {
        const { data, member, id } = message;
        setMessageList([...messageList, { member, text: data, id }]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, messageList]);

  useEffect(() => {
    if (isRoom) {
      const history = [];
      room.on("history_message", message => {
        const { data, clientId, id } = message;
        history.push({
          member: { clientData: { color: "red" }, id: clientId },
          text: data,
          id
        });
        setMessageList([...history]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRoom]);

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
 * @property {message[]} [messageList]
 * @property {member} [member]
 * @property {()=>void} [onSendMessage]
 * @property {string} [text]
 * @property {React.Dispatch<React.SetStateAction<string>>} [setText]
 */
