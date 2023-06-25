import styled from "styled-components";
import NoFriendsImg from "../../assets/noFriends.png";
import NoChanelImg from "../../assets/no-talking.png";
import NoGameImg from "../../assets/noGame.png";
import NoAchiveImg from "../../assets/noAchivement.png";

const ImgAnimation = styled.img`
  animation: bounce 2s infinite;
  @keyframes bounce {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-5px);
    }
    100% {
      transform: translateY(0);
    }
  }
`;

export const NoFriend = () => {
  return (
    <div className="flex flex-col gap-5  justify-center items-center h-full">
      <ImgAnimation src={NoFriendsImg} alt="" width={150} className="" />
      <h1 className="text-2xl font-bold uppercase">No Friends</h1>
    </div>
  );
};

export const NoChanel = () => {
  return (
    <div className="flex flex-col gap-5  justify-center items-center h-full  ">
      <ImgAnimation src={NoChanelImg} alt="" width={150} className="" />
      <h1 className="text-2xl font-bold uppercase">No Joined Chanels</h1>
    </div>
  );
};

export const NoGame = () => {
  return (
    <div className="flex flex-col gap-5  justify-center items-center h-full">
      <ImgAnimation src={NoGameImg} alt="" width={150} className="" />
      <h1 className="text-2xl font-bold uppercase">No Game History</h1>
    </div>
  );
};

export const NoAchivements = () => {
  return (
    <div className="flex flex-col gap-5  justify-center items-center h-full">
      <ImgAnimation src={NoAchiveImg} alt="" width={150} className="" />
      <h1 className="text-2xl font-bold uppercase">No Achivements</h1>
    </div>
  );
};
