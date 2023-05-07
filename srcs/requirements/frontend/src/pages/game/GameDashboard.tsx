import { ReusableCardStyle } from "./Home";
import { Link } from "react-router-dom";
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
    <div className="bg-white shadow-gray-400/50 shadow-md rounded-lg p-2 text-gray-700 flex flex-col gap-4 justify-center items-center hover:scale-105 transition-all duration-200 h-full">
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

const GameDashboard = () => {
  return (
    <div className="grid grid-cols-12 gap-10 grid-rows-2  h-full">
      <div className="col-span-4 row-span-1 flex justify-center items-center">
        <Link to="/game/10"  className="  left flex-1 h-[80%] w-full flex flex-col justify-center items-center ">
          <GameTypeCard title="Round Table" description="Play Aainst "  />
        </Link>
        <Link to="/game/10" className="left flex-1 h-[80%] w-full flex flex-col justify-center items-center">
          <div className="title text-4xl font-bold text-[#E9D990] text-center mb-4">
            Timing Table
          </div>
          <div className="w-[12rem] aspect-square border-[1.2rem]  border-yellow-200/50 rounded-[50%] flex items-center justify-center"></div>
        </Link>
      </div>
      <ReusableCardStyle className="col-span-8 row-span-1 flex justify-between items-center gap-4">
        <div className="left w-[60%] h-full ">
          <div className="title text-4xl font-bold text-[#E9D990] text-center mb-4">
            Round Table
          </div>
          <div className="challenger h-[80%]  flex flex-wrap justify-between items-center gap-4 overflow-y-scroll">
            {chalenger.map((challenger, index) => (
              <div key={index} className="w-[45%] text-xl flex justify-between items-center border border-[#E9D990] rounded-md p-3">
                {challenger.name} - {challenger.compus}
                <button className="bg-[#E9D990] text-black rounded-md px-2 py-1"> challenge </button>
              </div>
            ))}
          </div>
        </div>
      </ReusableCardStyle>
      <ReusableCardStyle className="col-span-12 row-span-1">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere dolorem
        saepe vero natus eveniet eum cupiditate corrupti, eligendi sunt hic quo
        tenetur quod asperiores amet nesciunt suscipit in reprehenderit quas!
      </ReusableCardStyle>
    </div>
  );
};

export default GameDashboard;
