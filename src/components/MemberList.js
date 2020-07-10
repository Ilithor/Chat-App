import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useMessageData } from "../MessageBoardContext";

export const MemberList = () => {
  const { memberList } = useMessageData();
  const [memberDisplay, setMemberDisplay] = useState("");
  useEffect(() => {
    let temp = "";
    _.map(memberList, member => {
      if (temp === "") {
        temp = member;
      } else {
        temp += `, ${member}`;
      }
    });
    setMemberDisplay(temp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberList]);
  return (
    <div>
      {memberList.length} {memberList.length === 1 ? "member" : "members"}{" "}
      currently logged in: {memberDisplay}
    </div>
  );
};
