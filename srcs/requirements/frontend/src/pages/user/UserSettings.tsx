import styled from "styled-components";
import Data from "../../components/Profile/UserSettings/Data";
import Avatar from "../../components/Profile/UserSettings/Avatar";
import CheckMark from "../../components/Profile/UserSettings/CheckMark";

const UserSettingsContainer = styled.div` 
  .main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 3rem;
    Data  {
      color: black;
    }
    h1 {
      font-size: larger;
      font-weight: bolder;
    }
    //height: 100%;

    
  }

`;

const UserSettings = () => {

  return (
    <UserSettingsContainer>
      <div className="main ">
        <div className="user-info">
            <h1>User Informations</h1>
            <Data></Data>
        </div>
        <div className="profile-picture">
            <h1>Profile picture</h1>
            <Avatar></Avatar>
        </div>
      <div className="tfa">
            <h1>Two Factor Authentication</h1>
            <CheckMark></CheckMark>
      </div>
      </div>
    </UserSettingsContainer>
  );
};

export default UserSettings;
