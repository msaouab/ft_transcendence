import { Link } from "react-router-dom";
import { useGlobalContext } from "../../provider/AppContext";

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

export const FreindCard = ({
  avatar,
  firstName,
  lastName,
  status,
  id,
}: any) => {
  const { userId } = useGlobalContext();
  return (
    <Link
      to={id === userId ? "/profile" : `/profile/${id}`}
      className="flex flex-wrap mx-2 p-2 gap-4 items-center bg-white rounded-lg text-gray-600 relative shadow-sm shadow-white	min-h-[4rem]"
    >
      <div className="image ">
        <img src={avatar} alt="" width={50} />
      </div>
      <div className="name text-md xl:text-xl font-[500] capitalize">
        {firstName.slice(0, 1) + "."}{lastName}
      </div>
      <div className="status justify-self-end absolute right-3 flex gap-1  items-center">
        {status}
        <div
          className={`dot w-3 h-3 ${CheckStatus(status)} rounded-full`}
        ></div>
      </div>
    </Link>
  );
};

export const GameCard = () => {
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

export const ChanelCard = ({ channel_name, role, channel_id }: any) => {
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
          <span className="text-[#a5842f] text-xl capitalize">{role}</span>
        </div>
      </div>
    </Link>
  );
};

export const AchivementCard = ({ name, description, image }: any) => {
  return (
    <div className="debug h-full min-w-[300px]">
      <div className="bg-white lg:w-[80%] w-[95%] m-auto  shadow-gray-400/50 shadow-md rounded-lg p-2 text-gray-700 flex flex-col gap-4 justify-center items-center hover:scale-105 transition-all duration-200 h-full">
        <div className="image">
          <img src={image} alt="" width={150} />
        </div>
        <div className="title text-center font-bold text-xl  text-red-500">
          {name}
        </div>
        <div className="description text-center">{description}</div>
      </div>
    </div>
  );
};
