import defaultimg from "../../../assets/arcade-game.png";

const ChanelCard = () => {
  return (
    <div className="bg-[#d9d9d94c] rounded-lg p-3 flex items-center justify-between min-h-[3.5rem]">
      <div className="info flex gap-3">
        <img src={defaultimg} alt="" className="w-[40px] max-w-[100%] h-auto" />
        <div className="name">
          <div className="text-xl font-semibold">Title</div>
          <div className="text-sm ">Last msg</div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="last-msg">Time</div>
        <div className="flex justify-center items-center bg-orange-700 w-6 text-sm aspect-square rounded-[50%] text-gray-50">
          5
        </div>
      </div>
    </div>
  );
};

function ChanelList() {
  return (
    <div className="bg-[#d9d9d94c] p-5 rounded-3xl">
      <div className="title text-2xl font-[700] border-b border-gray-100/30 mb-5">
        Chanels
      </div>
      <div className="flex flex-col gap-1 max-h-[20rem] overflow-y-scroll pr-1 ">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <ChanelCard key={i} />
          ))}
      </div>
    </div>
  );
}

export default ChanelList;
