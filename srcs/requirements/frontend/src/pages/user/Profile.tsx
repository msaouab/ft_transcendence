import styled from "styled-components";
import SideBar from "../../components/common/SideBar";
// import Ldata from "../loginPage/datalogin";
import Cover from "../../components/Profile/Cover";

const ProfileContainer = styled.div`
  display: grid;
  /* overflow: hidden; */
  /* position: absolute; */
  /* margin: 1rem 1rem 1rem 7rem; */
  margin-left: 7rem;
  padding-top: 1rem;
`;


const Profile = () => {

  return (
    <ProfileContainer>
    <SideBar/>
    <div className="profile"></div>
        <div className="cover">
            <Cover></Cover>
          </div>
        <div className="">
            {/* <GameHistory></GameHistory> */}
          </div>
        <div className="">
            {/* <Achievement></Achievement> */}
          </div>
        <div className="">
            {/* <FriendList></FriendList> */}
        </div>
    </ProfileContainer>
  );
};

export default Profile;
