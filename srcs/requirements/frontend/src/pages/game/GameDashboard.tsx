import React from "react";
import { ReusableCardStyle } from "./Profile";

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

const GameDashboard = () => {
  return (
    <div className="grid grid-cols-12 gap-10 grid-rows-2  h-full">
      <ReusableCardStyle className="col-span-4 row-span-1 flex justify-center items-center">
        <div className="left flex-1 h-[80%] w-full flex flex-col justify-center items-center">
          <div className="title text-4xl font-bold text-[#E9D990] text-center mb-4">
            Round Table
          </div>
          <div className="w-[12rem] aspect-square border-[1.2rem]  border-yellow-200/50 rounded-[50%] flex items-center justify-center"></div>
        </div>
        <div className="left flex-1 h-[80%] w-full flex flex-col justify-center items-center">
          <div className="title text-4xl font-bold text-[#E9D990] text-center mb-4">
            Timing Table
          </div>
          <div className="w-[12rem] aspect-square border-[1.2rem]  border-yellow-200/50 rounded-[50%] flex items-center justify-center"></div>
        </div>
      </ReusableCardStyle>
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
