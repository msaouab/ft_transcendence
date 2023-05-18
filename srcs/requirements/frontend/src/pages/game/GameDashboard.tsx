import { ReusableCardStyle } from "./Profile";
import { Link } from "react-router-dom";
import RoundTable from "../../assets/roundTable.png";
import TimingTable from "../../assets/timeTable.png";
import GetChallenge from "../../assets/getChallenge.png";
import Avatar from "../../assets/avatar.png";
import SwiperComponent from "../../components/common/Slider";
import AchivementImg1 from "../../assets/achivement1.png";
import AchivementImg2 from "../../assets/achivement2.png";
import PlayWithMe from "../../assets/playWithMe.png";
import GameImg from "../../assets/gameImg.png";

const chalenger = [
  {
    name: "Ilyass",
    compus: "1337 KH",
  },
  {
    name: "koko",
    compus: "1337 BG",
  },
  {
    name: "Nani",
    compus: "1337 Med",
  },
  {
    name: "Ilyass",
    compus: "1337 KH",
  },
  {
    name: "koko",
    compus: "1337 BG",
  },
  {
    name: "Nani",
    compus: "1337 Med",
  },
  {
    name: "Ilyass",
    compus: "1337 KH",
  },
  {
    name: "koko",
    compus: "1337 BG",
  },
  {
    name: "Nani",
    compus: "1337 Med",
  },
  {
    name: "Ilyass",
    compus: "1337 KH",
  },
  {
    name: "koko",
    compus: "1337 BG",
  },
  {
    name: "Nani",
    compus: "1337 Med",
  },
];

const GameTypeCard = ({ title, description, imgPath }: any) => {
  return (
    <div className="bg-white shadow-gray-400/50 shadow-md rounded-lg p-2 text-gray-700 flex flex-col gap-4 justify-center items-center hover:scale-105 transition-all duration-200 w-full h-full">
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

interface ChalengerCardProps {
  name: string;
}
const ChalengerCard = (props: ChalengerCardProps) => {
  const { name } = props;
  return (
    <div className="flex p-2 gap-4 items-center bg-white rounded-lg text-gray-600 relative shadow-sm shadow-white	min-h-[5rem]">
      <div className="image">
        <img src={Avatar} alt="" width={60} />
      </div>
      <div className="name text-2xl font-[800]">{name}</div>
      <div className="status justify-self-end absolute right-3 flex gap-1  items-center">
        <button className="flex gap-2 items-center m-1 border border-gray-500 rounded-md p-2 hover:scale-105 transition-all shadow-md">
          challenge <img src={PlayWithMe} alt="" width={20} />
        </button>
        {/* <div className="dot w-3 h-3 bg-green-500 rounded-full"></div> */}
      </div>
    </div>
  );
};

interface GameCardProps {
  title: string;
  description: string;
  imgPath: string;
}

const GameCard = (props: GameCardProps) => {
  const { title, description, imgPath } = props;
  return (
    <div className="h-full p-5 flex justify-center ">
      <div className="w-[70%] cursor-pointer max-w-[300px] bg-white  shadow-gray-400/50 shadow-md rounded-lg p-2 text-gray-700 flex flex-col gap-4 justify-center items-center hover:scale-105 transition-all duration-200 h-full">
        <div className="image border-deep-purple-400 border-4 rounded-[50%] p-8">
          <img src={imgPath} alt="" width={150} />
        </div>
        <div className="flex justify-between  w-[80%] text-xl font-bold border border-black/40 shadow-sm p-2 rounded-md ">
          Moha
          <span>1 - 2</span>
          Ilyass
        </div>
      </div>
    </div>
  );
};

const GameDashboard = () => {
  return (
    <div className="flex    flex-col gap-5  h-full ">
      <div className="h-[30rem]  w-full flex gap-5 pt-5 ">
        <div className=" h-full  w-[25%]  flex flex-col p-2 border border-white/50 rounded-xl">
          <div className="title text-white font-semibold text-xl flex gap-4 items-center mb-4">
            <img src={GetChallenge} alt="" width={50} />
            Choose your game type
          </div>
          <div className="flex-1 flex items-center gap-5  ">
            <Link
              to="/game-type"
              className="  left flex-1 h-[80%] w-full flex flex-col justify-center items-center  cursor-pointer "
            >
              <GameTypeCard
                title="Round Table"
                description="Play Aainst "
                imgPath={RoundTable}
              />
            </Link>
            <Link
              to="/game-type"
              className="left flex-1 h-[80%] w-full flex flex-col justify-center items-center cursor-pointer"
            >
              <GameTypeCard
                title="Timing Table"
                description="Play Aainst "
                imgPath={TimingTable}
              />
            </Link>
          </div>
        </div>
        <div className="flex-1  flex justify-between items-center gap-4  p-2 border border-white/50 rounded-xl ">
          <div className="left  h-full flex gap-5 flex-1">
            <div className="left flex-1 ">
              <div className="title text-white font-semibold text-xl flex gap-4 items-center mb-4">
                <img src={GetChallenge} alt="" width={50} />
                Get your challenge
              </div>
              <div className="description text-white  h-[80%] overflow-y-scroll flex flex-col gap-3 p-2">
                {chalenger.map((chalenger, index) => (
                  <ChalengerCard key={index} name={chalenger.name} />
                ))}
              </div>
            </div>
            <div className="right flex-1 ">
              <div className="title text-white font-semibold text-xl flex gap-4 items-center mb-4">
                <img src={GetChallenge} alt="" width={50} />
                Who challenge you
              </div>
              <div className="description text-white  h-[80%] overflow-y-scroll flex flex-col gap-3 p-2">
                {chalenger.map((chalenger, index) => (
                  <ChalengerCard key={index} name={chalenger.name} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1  p-2 w-[70%] max-w-[1000px] m-auto">
        <h1 className=" text-2xl font-bold text-center mb-2   ">Live Games</h1>
        <div className="h-[90%] max-h-[400px] border border-white/50 rounded-xl shadow-sm shadow-white">
          <SwiperComponent
            slides={Array(10).fill(
              <GameCard
                title="Achivement 1"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."
                imgPath={GameImg}
              />
            )}
          ></SwiperComponent>
        </div>
      </div>
    </div>
  );
};

export default GameDashboard;
