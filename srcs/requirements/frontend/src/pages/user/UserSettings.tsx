import styled from "styled-components";
import Data from "../../components/Profile/UserSettings/Data";
import Avatar from "../../components/Profile/UserSettings/Avatar";
import CheckMark from "../../components/Profile/UserSettings/CheckMark";
import { Button } from "@material-tailwind/react";

const UserSettingsContainer = styled.div`
  .main {
    //height: 100%;
  }
`;

const UserSettings = () => {
  return (
      <div className="main text-white flex flex-col justify-center gap-10  items-center  h-[80%]  ">
        <div className="profile-picture">
          <Avatar></Avatar>
        </div>
        <div className="user-info">
          <Data></Data>
        </div>
      <div className="tfa">
            <h1>Two Factor Authentication</h1>
            <CheckMark></CheckMark>
      </div>
      </div>
  );
};

export default UserSettings;
