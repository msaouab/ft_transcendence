import { ReusableCardStyle } from "./Home";
import { Link } from "react-router-dom";
import RoundTable from "../../assets/roundTable.png";
import TimingTable from "../../assets/timeTable.png";
import GetChallenge from "../../assets/getChallenge.png";
import Avatar from "../../assets/avatar.png";
import PlayWithMe from "../../assets/playWithMe.png";

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
        <button className="flex gap-2 items-center m-1 border border-gray-500 rounded-md p-2">
          challenge <img src={PlayWithMe} alt="" width={20} />
        </button>
        {/* <div className="dot w-3 h-3 bg-green-500 rounded-full"></div> */}
      </div>
    </div>
  );
};

const GameDashboard = () => {
  return (
    <div className="grid grid-cols-12 gap-10   h-full">
      <div className="col-span-4 row-span-1 max-h-[50%] flex justify-center items-center gap-4">
        <Link
          to="/game/10"
          className="  left flex-1 h-[80%] w-full flex flex-col justify-center items-center  "
        >
          <GameTypeCard
            title="Round Table"
            description="Play Aainst "
            imgPath={RoundTable}
          />
        </Link>
        <Link
          to="/game/10"
          className="left flex-1 h-[80%] w-full flex flex-col justify-center items-center"
        >
          <GameTypeCard
            title="Timing Table"
            description="Play Aainst "
            imgPath={TimingTable}
          />
        </Link>
      </div>
      <div className="col-span-8 max-h-[50%] flex justify-between items-center gap-4 rounded-lg border border-gray-300 p-4">
        <div className="left  h-full flex gap-5 flex-1">
          <div className="left flex-1 ">
            <div className="title text-white font-semibold text-xl flex gap-4 items-center mb-4">
              <img src={GetChallenge} alt="" width={50} />
              Get your challenge
            </div>
            <div className="description text-white  h-[80%] overflow-y-scroll flex flex-col gap-3">
              {chalenger.map((chalenger, index) => (
                <ChalengerCard key={index} name={chalenger.name} />
              ))}
            </div>
          </div>
          <div className="right flex-1 ">
            <div className="title text-white font-semibold text-xl flex gap-4 items-center mb-4">
              <img src={GetChallenge} alt="" width={50} />
              Get your challenge
            </div>
            <div className="description text-white  h-[80%] overflow-y-scroll flex flex-col gap-3">
              {chalenger.map((chalenger, index) => (
                <ChalengerCard key={index} name={chalenger.name} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <ReusableCardStyle className="col-span-12 row-span-1"></ReusableCardStyle>
    </div>
  );
};

export default GameDashboard;