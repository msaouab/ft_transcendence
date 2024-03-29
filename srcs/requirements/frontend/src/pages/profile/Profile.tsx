import styled from "styled-components";
import { useParams } from "react-router-dom";
import FriendsImg from "../../assets/friends.png";
import GameImg from "../../assets/game.png";
import ChatImg from "../../assets/chat.png";
import AchivementImg1 from "../../assets/achivement1.png";
import { useOutletContext } from "react-router-dom";
import Dice from "../../assets/dice.png";
import Draw from "../../assets/draw.png";
import Lose from "../../assets/lose.png";
import { useGlobalContext } from "../../provider/AppContext";
import { useEffect, useState } from "react";
import instance, {
  getAchivements,
  getChannels,
  getFriendsInfo,
  getRankData,
  getUserInfo,
} from "../../api/axios";
import SwiperComponent from "../../components/common/Slider";
import { FreindCard, GameCard, AchivementCard, ChanelCard } from "./Cards";
import {
  NoAchivements,
  NoChanel,
  NoFriend,
  NoGame,
} from "../../components/common/EmptyComponents";

export const ReusableCardStyle = styled.div`
  background: linear-gradient(
    180deg,
    rgba(233, 217, 144, 0.2379) 0%,
    rgba(233, 217, 144, 0) 100%
  );
  border-radius: 20px 20px 0px 0px;
  padding: 1rem;
`;

const Status = styled.div<{ userStatus: string }>`
position: relative;
/* width: 100px; */
/* aspect-ratio: 1/1; */
height: 100%;
img {
  position: relative;
  border-radius: 50%;
  border: 1px solid #f9c8c8;
  max-width: 80px;
  aspect-ratio: 1/1;
  object-fit: cover;
  @media (max-width: 1200px) {
    height: 70px;
    width: 70px;
  }
}
&:after {
  content: "";
  position: absolute;
  bottom: 5px;
  right: 10%;
  background-color: ${({ userStatus }: any) =>
    userStatus === "online"
      ? "#00ff00"
      : userStatus === "offline"
      ? "#6a6a6a"
      : userStatus === "donotdisturb"
      ? "#ff0000"
      : userStatus === "ingame"
      ? "#011c77"
      : "#ffcc00"};
  border: 1px solid #ececec;
  width: 15%;
  height: 15%;
  border-radius: 50%;
}
`;

const Top = styled.div`
@media (max-width: 1200px) {
  display: unset;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
`;

const Main = styled.div`
@media (max-width: 1200px) {
  flex-direction: column;
  .stats {
    height: unset;
    min-height: fit-content;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    & > div {
      max-width: 70%;
      min-width: 360px;
      max-height: 500px;
    }
  }
  .achievements {
    /* height: 500px; */
    /* width: 100%; */
    width: unset;
    .achiv-container {
      display: flex;
      flex-direction: column;
    }
  }
}
@media (max-width: 800px) {
  flex-direction: column;
  .stats {
    height: unset;
    min-height: fit-content;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    & > div {
      max-width: 90%;
      min-width: 360px;
      max-height: 500px;
    }
  }
  .achievements {
    /* height: 500px; */
    max-width: 90%;
    min-width: 360px;
    max-height: 500px;
    .achiv-container {
      display: flex;
      flex-direction: column;
      width: unset;
      max-width: 90%;
    }
  }
}
`;

interface friendsInterface {
  login: string;
  Status: string;
}

const Profile = () => {
  const { notifySocket, connected }: any = useOutletContext();
  const { id } = useParams(); // Extract the user ID from the URL params
  const { userImg } = useGlobalContext();
  const { userStatus } = useGlobalContext();
  const [user, setData] = useState({
    id: "",
    login: "",
    firstName: "",
    lastName: "",
    status: "",
    avatar: "",
  });
  const [rankData, setRankData] = useState({
    wins: "",
    loses: "",
    draws: "",
    level: "",
    rank: "",
  });

  const [friends, setFriends] = useState<friendsInterface[]>([]);
  const [joinedChannel, setJoinedChannel] = useState<friendsInterface[]>([]);
  const [achivements, setAchivements] = useState<friendsInterface[]>([]);
  const { userId } = useGlobalContext();

  useEffect(() => {
    getAllData();
  }, [userId]);

  const friendsData = async () => {
    const data = await getFriendsInfo(userId);
    setFriends(data);
  };
  const joinedChannelData = async () => {
    const data = await getChannels(userId);
    setJoinedChannel(data);
  };
  const achivementsData = async () => {
    const data = await getAchivements(userId);
    setAchivements(data);
  };
  const getUserData = async () => {
    const data = await getUserInfo(userId);
    setData(data);
  };

  const getAllData = () => {
    const rankData = async () => {
      const data = await getRankData(userId);
      setRankData(data);
    };
    friendsData();
    joinedChannelData();
    achivementsData();
    rankData();
    getUserData();
  };


  useEffect(() => {
    if (connected) {
      notifySocket.on("inviteAccepted", (data: any) => {
        friendsData();
        
      });
    }
  }, [connected]);

  return (
    <div className="  w-[100%] flex flex-col gap-5  ">
      <Top className="top   h-[6rem]   flex  flex-wrap  items-center  gap-10 border-b border-white/50 pb-2 ">
        {user && (
          <>
            <Status className="" userStatus={userStatus.toLowerCase()}>
              <img src={user?.avatar} alt="" className="" />
            </Status>
            <div className="description flex flex-col  text-center justify-center ">
              <div className="name md:text-4xl text-xl  font-[800] ">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="name  font-[400] ">{user?.login}</div>
              <div className="flex gap-10 items-center "></div>
            </div>
          </>
        )}
        {rankData && (
          <div className="gamesInfo  h-full justify-self-stretch flex-1 flex flex-wrap justify-around  gap-6  ">
            <div className="gamesNumber flex   items-center gap-1 text-xl font-[600]">
              <img src={Dice} alt="_" width={40} />
              Games : {rankData?.wins + rankData?.loses + rankData?.draws}
            </div>
            <div className="gamesNumber flex items-center gap-1 text-xl font-[600]">
              <img src={AchivementImg1} width={40} alt="_" />
              Wins : {rankData?.wins}
            </div>
            <div className="gamesNumber flex items-center gap-1 text-xl font-[600]">
              <img src={Draw} alt="_" width={40} />
              Draw: {rankData?.draws}
            </div>
            <div className="gamesNumber flex items-center gap-1 text-xl font-[600]">
              <img src={Lose} alt="_" width={40} />
              Lose: {rankData?.loses}
            </div>
          </div>
        )}
      </Top>
      <Main className="midel flex-1  flex flex-col gap-4 items-center  ">
        <div className="stats  flex gap-6 h-[25rem] w-full   ">
          <div className="friends flex-1  flex flex-col gap-2 rounded-lg border border-gray-300 p-4 h-[100%] h-[25rem] ">
            <div className="top border-b border-white/50  h-[5rem]  ">
              <div className="title text-2xl font-[600] flex  gap-2  items-center ">
                <img src={FriendsImg} alt="" width={50} />
                Friends
              </div>
            </div>
            <div className="chanel h-full  py-2 ">
              {friends && friends?.length > 0 ? (
                <div className="flex flex-col  gap-5 overflow-y-scroll h-full ">
                  {friends.map((Friend, index) => (
                    <FreindCard key={index} {...Friend} />
                  ))}
                </div>
              ) : (
                <NoFriend />
              )}
            </div>
          </div>
          <div className="chanels flex-1  flex flex-col gap-2 rounded-lg border border-gray-300 p-4 h-[25rem]">
            <div className="top border-b border-white/50  h-[5rem]  ">
              <div className="title text-2xl font-[600] flex gap-2  items-center">
                <img src={ChatImg} alt="" width={50} />
                Chanels
              </div>
            </div>
            <div className="chanel h-full overflow-y-scroll py-2 flex flex-col gap-2">
              {joinedChannel && joinedChannel.length ? (
                <div className="flex flex-col  gap-5 overflow-y-scroll h-full ">
                  {joinedChannel.map((chanel, index) => (
                    <ChanelCard key={index} {...chanel} />
                  ))}
                </div>
              ) : (
                <NoChanel />
              )}
            </div>
          </div>
          <div className="last-games flex-1  flex flex-col gap-2 rounded-lg border border-gray-300 p-4 h-[25rem]">
            <div className="top border-b border-white/50  h-[5rem]">
              <div className="title text-2xl font-[600] flex gap-2  items-center">
                <img src={GameImg} alt="" width={50} />
                Last Games
              </div>
            </div>
            <div className="chanel h-full overflow-y-scroll py-2 flex flex-col gap-2">
              {false ? <GameCard /> : <NoGame />}
            </div>
          </div>
        </div>
        <div className="achievements border border-gray-300-100 rounded-xl p-4   h-[40%]  w-[70%] m-auto">
          <div className="title bo text-4xl mb-4 font-[600]   gap-2  items-center flex-1 text-center underline flex justify-center ">
            Achievements
          </div>
          <div className="achiv-container flex gap-10   m-auto min-h-[20rem]">
            {achivements && achivements.length ? (
              <div className="h-[90%] w-full max-h-[400px] border border-white/50 rounded-xl shadow-sm shadow-white">
                <SwiperComponent
                  slides={achivements.map((achivement, index) => (
                    <AchivementCard key={index} {...achivement} />
                  ))}
                ></SwiperComponent>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full ">
                <NoAchivements />
              </div>
            )}
          </div>
        </div>
      </Main>
    </div>
  );
};

export default Profile;