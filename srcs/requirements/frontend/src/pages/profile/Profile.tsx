import PadelSvg from "../../assets/icons/PadelSvg";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Avatar from "../../assets/avatar.png";
import PlayWithMe from "../../assets/playWithMe.svg";
import FriendsImg from "../../assets/friends.png";
import GameImg from "../../assets/game.png";
import ChatImg from "../../assets/chat.png";
import AchivementImg1 from "../../assets/achivement1.png";
import AchivementImg2 from "../../assets/achivement2.png";
import AchivementImg3 from "../../assets/achivement3.png";
import AchivementImg4 from "../../assets/achivement4.png";
import Dice from "../../assets/dice.png";
import Draw from "../../assets/draw.png";
import Lose from "../../assets/lose.png";
import { useGlobalContext } from "../../provider/AppContext";
import { useEffect, useState } from "react";
import instance, { getChannels, getFriendsInfo } from "../../api/axios";
import Cookies from "js-cookie";
import axios from "axios";

export const ReusableCardStyle = styled.div`
  background: linear-gradient(
    180deg,
    rgba(233, 217, 144, 0.2379) 0%,
    rgba(233, 217, 144, 0) 100%
  );
  border-radius: 20px 20px 0px 0px;
  padding: 1rem;
`;

const CheckStatus = (stats: string) => {
  const status = stats?.toLowerCase();
  if (status == "online") {
    return "bg-green-500";
  } else if (status == "offline") {
    return "bg-red-500";
  } else if (status == "busy") {
    return "bg-yellow-500";
  } else if (status == "ingame") {
    return "bg-blue-500";
  }
};

const FreindCard = ({ avatar, firstName, lastName, status }: any) => {
  return (
    <div className="flex mx-2 p-2 gap-4 items-center bg-white rounded-lg text-gray-600 relative shadow-sm shadow-white	min-h-[4rem]">
      <div className="image ">
        <img src={avatar} alt="" width={60} />
      </div>
      <div className="name text-xl font-[500]">
        {firstName} {lastName}
      </div>
      <div className="status justify-self-end absolute right-3 flex gap-1  items-center">
        {status}
        <div
          className={`dot w-3 h-3 ${CheckStatus(status)} rounded-full`}
        ></div>
      </div>
    </div>
  );
};

const GameCard = () => {
  return (
    <div className="flex justify-center mx-2 p-2 gap-4 items-center bg-white rounded-lg text-gray-600 relative shadow-sm shadow-white min-h-[4rem]	">
      <div className="flex items-center gap-7">
        <div className="firstAdversary text-xl">Lala dodo</div>
        <div className="result text-xl font-bold text-red-400">1 - 0</div>
        <div className="secondAdversary text-xl">Koko Nani</div>
      </div>
    </div>
  );
};

const ChanelCard = ({ channel_name, role, channel_id }: any) => {
  return (
    <Link to={`/chat/${channel_id}`}>
      <div className="flex justify-around flex-wrap  mx-2 p-2 gap-4 items-center bg-white rounded-lg text-gray-600 relative shadow-sm shadow-white	min-h-[4rem]">
        <div className="chanelname  font-[500]">
          <span className="">Name: </span>
          <span className="text-[#a5842f] text-xl capitalize">
            {channel_name}
          </span>
        </div>
        <div className="chanelname  font-[500]">
          <span className="">Role: </span>
          <span className="text-[#a5842f] text-xl capitalize">
            {role}
          </span>
        </div>
        
      </div>
    </Link>
  );
};

const AchivementCard = ({ title, description, imgPath }: any) => {
  return (
    <div className="bg-white  shadow-gray-400/50 shadow-md rounded-lg p-2 text-gray-700 flex flex-col gap-4 justify-center items-center hover:scale-105 transition-all duration-200 h-full">
      <div className="image">
        <img src={imgPath} alt="" width={150} />
      </div>
      <div className="title text-center font-bold text-xl  text-red-500">
        {title}
      </div>
      <div className="description text-center">{description}</div>
    </div>
  );
};

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

const Home = () => {
  const { userImg } = useGlobalContext();
  const { userStatus } = useGlobalContext();
  const [user, setData] = useState({
    id: "",
    login: "",
    firstName: "",
    lastName: "",
    status: "",
  });
  const [rankData, getRankData] = useState({
    wins: "",
    loses: "",
    draws: "",
    level: "",
    rank: "",
  });

  useEffect(() => {
    const apiUrl = "http://localhost:3000/api/v1/me";
    async function fetchData() {
      try {
        await axios
          .get(apiUrl, {
            withCredentials: true,
          })
          .then((response) => {
            if (response.statusText) {
              setData(response.data);
            }
            // setOnlineStat(user.status);
          });
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const rankUrl =
      "http://localhost:3000/api/v1/User/" +
      Cookies.get("userid") +
      "/rankData";
    async function fetchRankData() {
      try {
        await axios
          .get(rankUrl, {
            withCredentials: true,
          })
          .then((response) => {
            if (response.statusText) {
              getRankData(response.data);
            }
          })
          .catch((error) => {
            if (error.response.status == 401) {
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
    fetchRankData();
  }, []);

  const [friends, setFriends] = useState<friendsInterface[]>([]);
  const [joinedChannel, setJoinedChannel] = useState<friendsInterface[]>([]);
  useEffect(() => {
    const friendsData = async () => {
      const data = await getFriendsInfo(Cookies.get("userid") || "");
      setFriends(data);
    };
    const joinedChannelData = async () => {
      const data = await getChannels(Cookies.get("userid") || "");
      setJoinedChannel(data);
    };
    friendsData();
    joinedChannelData();
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
        .achiv-container {
          display: flex;
          flex-direction: column;
          width: unset;
          max-width: 90%;
        }
      }
    }
  `;

  return (
    <div className="  w-[100%] flex flex-col gap-5  ">
      <Top className="top   h-[6rem]   flex  flex-wrap  items-center  gap-10 border-b border-white/50 pb-2 ">
        <Status className="" userStatus={userStatus.toLowerCase()}>
          {userImg && <img src={userImg} alt="" className="" />}
        </Status>
        <div className="description flex flex-col  text-center justify-center ">
          <div className="name md:text-4xl text-xl  font-[800] ">
            {user.firstName} {user.lastName}
          </div>
          <div className="name  font-[400] ">{user.login}</div>
          <div className="flex gap-10 items-center "></div>
        </div>
        <div className="gamesInfo  h-full justify-self-stretch flex-1 flex flex-wrap justify-around  gap-2  ">
          <div className="gamesNumber flex   items-center gap-4 text-xl font-[600]">
            <img src={Dice} alt="" width={50} />
            Games : {rankData.wins + rankData.loses + rankData.draws}
          </div>
          <div className="gamesNumber flex items-center gap-4 text-xl font-[600]">
            <img src={AchivementImg1} width={50} alt="" />
            Wins : {rankData.wins}
          </div>
          <div className="gamesNumber flex items-center gap-4 text-xl font-[600]">
            <img src={Draw} alt="" width={50} />
            Draw: {rankData.draws}
          </div>
          <div className="gamesNumber flex items-center gap-4 text-xl font-[600]">
            <img src={Lose} alt="" width={50} />
            Lose: {rankData.loses}
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
              {friends.length ? (
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
              {joinedChannel.length ? (
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
        <div className="achievements    h-[40%]  ">
          <div className="title bo text-4xl mb-4 font-[600]   gap-2  items-center flex-1 text-center underline flex justify-center ">
            Achievement
          </div>
          <div className="achiv-container flex gap-10 w-[80%] m-auto">
            <AchivementCard
              title="Achivement 1"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."
              imgPath={AchivementImg2}
            />
            <AchivementCard
              title="Achivement 1"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."
              imgPath={AchivementImg3}
            />
            <AchivementCard
              title="Achivement 1"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."
              imgPath={AchivementImg4}
            />
            <AchivementCard
              title="Achivement 1"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."
              imgPath={AchivementImg4}
            />
          </div>
        </div>
      </Main>
    </div>
  );
};

export default Home;
