import styled from "styled-components";
import SideBar from "../../components/common/SideBar";
// import Ldata from "../loginPage/datalogin";
import Cover from "../../components/Profile/Cover";
import GameHistory from "../../components/Profile/GameHistory";
import Achievements from "../../components/Profile/Achievements";
import FriendsList from "../../components/Profile/FriendsList";

const ProfileContainer = styled.div`
  display: grid;
  overflow: hidden;
  height: 100vh;
  /* position: absolute; */
  /* margin: 1rem 1rem 1rem 7rem; */
  margin-left: 7rem;
  padding-top: 5rem;
  margin-right: 1rem;
  display: grid;
  grid-template-rows: auto;
  gap: 1rem;

    .title {
      margin-left: 1rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
      font-size: 2rem;
      font-weight: bold;
      color: white;
    }
  .AchievsAndFriends {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

  }

  .AchFri {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding-left: 1rem ;

  }
`;


const Profile = () => {

  return (
    <ProfileContainer>
    <SideBar/>
    <div className="profile">
        <div className="cover">
            <Cover></Cover>
        </div>
        <div className="GameHistory">
          <h1 className="title">Game History</h1>
            <GameHistory></GameHistory>
        </div>
          <div className="AchFri">
          <h1 className="title">Achievements</h1>
          <h2 className="title"> Friends</h2>
          </div>
        <div className="AchievsAndFriends">
            <Achievements></Achievements>
            <FriendsList></FriendsList>
        </div>
    </div>
    </ProfileContainer>
  );
};

export default Profile;
