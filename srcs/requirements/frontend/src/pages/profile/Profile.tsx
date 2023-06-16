import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import FriendsImg from "../../assets/friends.png";
import GameImg from "../../assets/game.png";
import ChatImg from "../../assets/chat.png";
import AchivementImg1 from "../../assets/achivement1.png";

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
import Cookies from "js-cookie";
import SwiperComponent from "../../components/common/Slider";
import { FreindCard, GameCard, AchivementCard, ChanelCard } from "./Cards";

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
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  &:after {
    content: "";
    position: absolute;
    bottom: 5px;
    right: 10%;
    background-color: ${({ userStatus }) =>
      userStatus === "online"
        ? "#01d101"
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

interface friendsInterface {
  login: string;
  Status: string;
}

interface ProfileInterface {
  isAnotherUser?: boolean;
}
const Profile = (props: ProfileInterface) => {
  const { userImg } = useGlobalContext();
  const { userStatus } = useGlobalContext();
  const [user, setData] = useState({
    id: "",
    login: "",
    firstName: "",
    lastName: "",
    status: "",
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
  const [userId, setUserId] = useState(Cookies.get("userid") || "");

  const getAllData = () => {
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

    const rankData = async () => {
      const data = await getRankData(userId);
      setRankData(data);
    };

    const getUserData = async () => {
      const data = await getUserInfo(userId);
      setData(data);
    };

    friendsData();
    joinedChannelData();
    achivementsData();
    rankData();
    getUserData();
  };
  const { id } = useParams(); // Extract the user ID from the URL params

  useEffect(() => {
    if (props.isAnotherUser) {
      console.log("id", id);
      setUserId(id || "");
    }

    getAllData();
  }, []);

  const Status = styled.div<{ userStatus: string }>`
    position: relative;
    /* width: 100px; */
    /* aspect-ratio: 1/1; */
    height: 100%;
    img {
      position: relative;
      border-radius: 50%;
      height: 100%;
      width: 100%;
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
      background-color: ${({ userStatus }) =>
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

  console.log("user status inside profile is ", userStatus);
  return (
    <div className="  w-[100%] flex flex-col gap-5  ">
      <Top className="top   h-[6rem]   flex  flex-wrap  items-center  gap-10 border-b border-white/50 pb-2 ">
        <Status className="" userStatus={userStatus.toLowerCase()}>
          {userImg && <img src={userImg} alt="" className="" />}
        </Status>
        <div className="description flex flex-col  text-center justify-center ">
          <div className="name md:text-4xl text-xl  font-[800] ">
            {user?.firstName || ""} {user?.lastName || ""}
          </div>
          <div className="name  font-[400] ">{user?.login}</div>
          <div className="flex gap-10 items-center "></div>
        </div>
        <div className="gamesInfo  h-full justify-self-stretch flex-1 flex flex-wrap justify-around  gap-6  ">
          <div className="gamesNumber flex   items-center gap-1 text-xl font-[600]">
            <img src={Dice} alt="_" width={40} />
            Games : {rankData?.wins + rankData?.loses + rankData?.draws || " "}
          </div>
          <div className="gamesNumber flex items-center gap-1 text-xl font-[600]">
            <img src={AchivementImg1} width={40} alt="_" />
            Wins : {rankData?.wins || " "}
          </div>
          <div className="gamesNumber flex items-center gap-1 text-xl font-[600]">
            <img src={Draw} alt="_" width={40} />
            Draw: {rankData?.draws || " "}
          </div>
          <div className="gamesNumber flex items-center gap-1 text-xl font-[600]">
            <img src={Lose} alt="_" width={40} />
            Lose: {rankData?.loses || " "}
          </div>
        </div>
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
                <div className=" h-full flex justify-center items-center text-3xl">
                  No friends
                </div>
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
                <div className=" h-full flex justify-center items-center text-3xl">
                  No Joined Chanels
                </div>
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
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e: any, index: number) => (
                <GameCard key={index} />
              ))}
            </div>
          </div>
        </div>
        <div className="achievements border border-gray-300-100 rounded-xl p-4   h-[40%]  w-[70%] m-auto">
          <div className="title bo text-4xl mb-4 font-[600]   gap-2  items-center flex-1 text-center underline flex justify-center ">
            Achievements
          </div>
          <div className="achiv-container flex gap-10   m-auto ">
            {achivements && achivements.length ? (
              <div className="h-[90%] w-full max-h-[400px] border border-white/50 rounded-xl shadow-sm shadow-white">
                <SwiperComponent
                  slides={achivements.map((achivement, index) => (
                    <AchivementCard key={index} {...achivement} />
                  ))}
                ></SwiperComponent>
              </div>
            ) : (
              <div className=" h-full flex justify-center items-center text-3xl text-center">
                No Achivements
              </div>
            )}
          </div>
        </div>
      </Main>
    </div>
  );
};

export default Profile;
