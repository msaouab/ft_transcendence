import React from "react";
import GameImg from "../../assets/gameImg.png";
import Avatar from "../../assets/avatar.png";
import { Link } from "react-router-dom";

const Games = [
  {
    id: 1,
    name: "play vs bot",
    icon: "fas fa-robot",
  },
  {
    id: 2,
    name: "play vs player",
    icon: "fas fa-user",
  },
  {
    id: 3,
    name: "Random table",
    icon: "fas fa-dice",
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

const FreindCard = ({ img, name, points, rank }: any) => {
  return (
    <div className="flex mx-2 p-2 gap-4 items-center bg-white rounded-lg text-gray-600 relative shadow-sm shadow-white	min-h-[5rem]">
      <div className="image flex items-center gap-1 text-xl font-bold">
		{rank} - 
        <img src={Avatar} alt="" width={60} />
      </div>
      <div className="name text-2xl font-[800]">{name}</div>
      <div className="status justify-self-end absolute right-3 flex gap-1 text-xl font-bold  items-center">
        {points}pt
      </div>
    </div>
  );
};

const GameType = () => {
  return (
    <div className="h-full w-full  flex flex-col items-center ">
      <div className="game-type w-[60%] flex justify-between m-auto min-h-[25rem]">
        {Games.map((item, index) => (
          <Link
            key={index}
			to={`/game/10`}
		   className="w-[18rem]">
            <GameTypeCard
              title={item.name}
              description={item.name}
              imgPath={GameImg}
            />
          </Link>
        ))}
      </div>
      <div className="rank flex justify-center h-[30rem] w-full gap-10 ">
        <div className="border rounded-2xl flex-1 p-4 h-full">
          <h1 className="text-xl font-bold border-b-2 border-white pb-2 mb-2">
            Global Rank
          </h1>
          <div className="ranks flex flex-col gap-2 overflow-y-scroll h-[90%]">
            {Array(10)
              .fill(0)
              .map((item, index) => (
                <FreindCard name="koko" points="1337" rank={index+1} />
              ))}
          </div>
        </div>
        <div className="border rounded-2xl flex-1 p-4 h-full">
          <h1 className="text-xl font-bold border-b-2 border-white pb-2 mb-2">
            Friend Rank
          </h1>
          <div className="ranks flex flex-col gap-2 overflow-y-scroll h-[90%]">
            {Array(10)
              .fill(0)
              .map((item, index) => (
                <FreindCard name="koko" points="1337" />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameType;