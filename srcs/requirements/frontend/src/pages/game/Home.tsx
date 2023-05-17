import PadelSvg from "../../assets/icons/PadelSvg";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Avatar from "../../assets/avatar.png";
import PlayWithMe from "../../assets/playWithMe.svg";
import FreindsImg from "../../assets/freinds.png";
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
import instance from "../../api/axios";
import Cookies from "js-cookie";


export const ReusableCardStyle = styled.div`
  background: linear-gradient(
    180deg,
    rgba(233, 217, 144, 0.2379) 0%,
    rgba(233, 217, 144, 0) 100%
  );
  border-radius: 20px 20px 0px 0px;
  padding: 1rem;
`;

const FreindCard = () => {
  return (
    <div className="flex mx-2 p-2 gap-4 items-center bg-white rounded-lg text-gray-600 relative shadow-sm shadow-white	min-h-[5rem]">
      <div className="image">
        <img src={Avatar} alt="" width={60} />
      </div>
      <div className="name text-2xl font-[800]">Koko Nani</div>
      <div className="status justify-self-end absolute right-3 flex gap-1  items-center">
        online
        <div className="dot w-3 h-3 bg-green-500 rounded-full"></div>
      </div>
    </div>
  );
};

const GameCard = () => {
  return (
    <div className="flex justify-center mx-2 p-2 gap-4 items-center bg-white rounded-lg text-gray-600 relative shadow-sm shadow-white min-h-[5rem]	">
      <div className="flex items-center gap-7">
        <div className="firstAdversary text-xl">Lala dodo</div>
        <div className="result text-xl font-bold text-red-400">1 - 0</div>
        <div className="secondAdversary text-xl">Koko Nani</div>
      </div>
    </div>
  );
};

const ChanelCard = () => {
  return (
    <div className="flex mx-2 p-2 gap-4 items-center bg-white rounded-lg text-gray-600 relative shadow-sm shadow-white	min-h-[5rem]">
      <div className="chanelname text-xl font-bold">Mohima</div>
      <div className="membersNumber"> Members : 210</div>
      <div className="subject">Subject : Hadra Khauia</div>
    </div>
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
  img {
    position: relative;
    border-radius: 50%;
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
    z-index: 10;
  }
`;

const Home = () => {
  const [userAvatar, setUserAvatar] = useState("");
  const { userStatus } = useGlobalContext();

  const GetAvatar = async () => {
    await instance
      .get("/user/" + Cookies.get("userid") + "/avatar", {
        responseType: "blob",
      })
      .then((res) => {
        setUserAvatar(URL.createObjectURL(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    GetAvatar();
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-10">
      <div className="top  pb-5  flex items-center gap-10 border-b border-white/50  ">
        <Status className="" userStatus={userStatus.toLowerCase()}>
          {userAvatar && (
            <img src={userAvatar} alt="" width={100} className="" />
          )}
        </Status>
        <div className="description flex flex-col  justify-center">
          <div className="name text-4xl font-[800] ">Koko Nani</div>
          <div className="flex gap-10 items-center ">
            <div className="text-2xl">Ready to Play!!</div>
          </div>
        </div>
        <div className="gamesInfo  h-full justify-self-stretch flex-1 flex justify-around  gap-2  ">
          <div className="gamesNumber flex items-center gap-4 text-xl font-[600]">
            <img src={Dice} alt="" width={50} />
            Games : 10
          </div>
          <div className="gamesNumber flex items-center gap-4 text-xl font-[600]">
            <img src={AchivementImg1} width={50} alt="" />
            Wins : 10
          </div>
          <div className="gamesNumber flex items-center gap-4 text-xl font-[600]">
            <img src={Draw} alt="" width={50} />
            Draw: 0
          </div>
          <div className="gamesNumber flex items-center gap-4 text-xl font-[600]">
            <img src={Lose} alt="" width={50} />
            Lose: 0
          </div>
        </div>
      </div>
      <div className="midel h-[50rem]  flex flex-col gap-4 items-center  ">
        <div className="stats flex gap-6 h-[50%] w-full">
          <div className="freinds flex-1  flex flex-col gap-2 rounded-lg border border-gray-300 p-4 h-full ">
            <div className="top border-b border-white/50  h-[5rem]  ">
              <div className="title text-2xl font-[600] flex  gap-2  items-center ">
                <img src={FreindsImg} alt="" width={50} />
                Freinds
              </div>
            </div>
            <div className="chanel h-full overflow-y-scroll py-2 flex flex-col gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e: any) => (
                <FreindCard />
              ))}
            </div>
          </div>
          <div className="chanels flex-1  flex flex-col gap-2 rounded-lg border border-gray-300 p-4 h-full ">
            <div className="top border-b border-white/50  h-[5rem]  ">
              <div className="title text-2xl font-[600] flex gap-2  items-center">
                <img src={ChatImg} alt="" width={50} />
                Chanels
              </div>
            </div>
            <div className="chanel h-full overflow-y-scroll py-2 flex flex-col gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e: any) => (
                <ChanelCard />
              ))}
            </div>
          </div>
          <div className="last-games flex-1  flex flex-col gap-2 rounded-lg border border-gray-300 p-4 h-full ">
            <div className="top border-b border-white/50  h-[5rem]">
              <div className="title text-2xl font-[600] flex gap-2  items-center">
                <img src={GameImg} alt="" width={50} />
                Last Games
              </div>
            </div>
            <div className="chanel h-full overflow-y-scroll py-2 flex flex-col gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e: any) => (
                <GameCard />
              ))}
            </div>
          </div>
        </div>
        <div className="achievements    h-[40%] mt-6 ">
          <div className="title bo text-4xl mb-4 font-[600]   gap-2  items-center flex-1 text-center underline flex justify-center ">
            Achievement
          </div>
          <div className="flex gap-10 w-[80%] m-auto">
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
      </div>
      {/* <ReusableCardStyle className="profile-card    w-[35rem] min-h-[12rem] ">
        <div className="name text-6xl font-[800] mb-6">Ilyass</div>
        <div className="flex gap-16 items-center ">
          <div className="text-2xl">It’s good to see you again.</div>
          <div className="padel">
            <PadelSvg />
          </div>
        </div>
      </ReusableCardStyle>
      <ReusableCardStyle className="min-h-[20rem]">
        <div className="top flex justify-between items-center mb-4">
          <h1>LAST ACHIEVEMENTS</h1>
          <Link
            to="/game"
            className="text-[#E9D990] border border-[#E9D990] p-2"
          >
            SEE ALL ACHIEVEMENTS
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Achivements.map((achivement, index) => (
            <AchivementCard key={index}>
              <div className="title">{achivement.title}</div>
              <div className="description">{achivement.description}</div>
            </AchivementCard>
          ))}
        </div>
      </ReusableCardStyle> */}
    </div>
  );
};

export default Home;
