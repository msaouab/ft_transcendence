import PadelSvg from "../../assets/icons/PadelSvg";
import styled from "styled-components";

const ProfileCard = styled.div`
  background: linear-gradient(180deg, rgba(233, 217, 144, 0.2379) 0%, rgba(233, 217, 144, 0) 100%);
  `


const Profile = () => {
  return (
    <div className="w-full h-full">
      <ProfileCard className="profile-card rounded-2xl debug  text-white w-[35rem] min-h-[12rem] " >
        <div className="name text-6xl font-[800] mb-6">Hello Ilyass</div>
        <div className="flex gap-16 items-center ">
          <div className="text-2xl">It’s good to see you again.</div>
          <div className="padel">l
            <PadelSvg />
          </div>
        </div>
      </ProfileCard>
    </div>
  );
};

export default Profile;
