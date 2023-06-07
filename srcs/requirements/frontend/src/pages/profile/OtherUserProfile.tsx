import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import FriendsImg from "../../assets/friends.png";
import GameImg from "../../assets/game.png";
import ChatImg from "../../assets/chat.png";
import { CiCircleMore } from "react-icons/ci";
import { AiOutlineUserAdd, AiOutlineUserDelete } from "react-icons/ai";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { Top, Status, Main } from "./ProfileStyle";

import AchivementImg1 from "../../assets/achivement1.png";

import Dice from "../../assets/dice.png";
import Draw from "../../assets/draw.png";
import Lose from "../../assets/lose.png";
import { useGlobalContext } from "../../provider/AppContext";
import { useEffect, useId, useState } from "react";
import instance, {
  GetAvatar,
  RemoveThisFriendInvite,
  addFriend,
  blockThisUser,
  deleteFreind,
  getAchivements,
  getChannels,
  getFriendsInfo,
  getRankData,
  getUserInfo,
  isFriend,
  unblockThisUser,
} from "../../api/axios";
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

interface friendsInterface {
  login: string;
  Status: string;
}

const OtherUserProfile = () => {
  const { id } = useParams(); // Extract the user ID from the URL params
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
  const [avatar, setAvatar] = useState("");
  const { userId } = useGlobalContext();
  const [relationStatus, setRelationStatus] = useState("");

  useEffect(() => {
    getAllData();
  }, [userId]);

  const getAllData = () => {
    if (id === "") return;

    const friendsData = async () => {
      const data = await getFriendsInfo(id || "");
      setFriends(data);
    };
    const joinedChannelData = async () => {
      const data = await getChannels(id || "");
      setJoinedChannel(data);
    };
    const achivementsData = async () => {
      const data = await getAchivements(id || "");
      setAchivements(data);
    };

    const rankData = async () => {
      const data = await getRankData(id || "");
      setRankData(data);
    };

    const getUserData = async () => {
      const data = await getUserInfo(id || "");
      setData(data);
    };

    const getUserAvatar = async () => {
      const data = await GetAvatar(id || "");
      setAvatar(data);
    };
    const isMyFriend = async () => {
      const data = await isFriend(userId || "", id || "");
      console.log("shfhlsfjsjf", data);
      if (data) setRelationStatus(data);
    };

    friendsData();
    joinedChannelData();
    achivementsData();
    rankData();
    getUserData();
    getUserAvatar();
    isMyFriend();
  };

  const sendFriendInvitation = async () => {
    const data = await addFriend(userId, id || "");
    console.log(data);
  };

  const BlockUser = async () => {
    const data = await blockThisUser(userId, id || "");
    console.log(data);
  };

  const unblockUser = async () => {
    const data = await unblockThisUser(userId, id || "");
    console.log(data);
  };

  const RemoveFriendInvite = async () => {
    const data = await RemoveThisFriendInvite(userId, id || "");
    console.log(data);
  };

  const DeleteFriend = async () => {
    const data = await deleteFreind(userId, id || "");
    console.log(data);
  };

  // a function that returns the type of the relation between the current user and the user whose profile is being viewed and
  const FriendRelatioType = () => {
    if (relationStatus === "notFriend") {
      return (
        <div className="w-full p-2 ">
          <button
            className="hover:scale-105 text-white px-4 py-2 rounded-md flex items-center gap-3  border-blue-gray-50"
            onClick={sendFriendInvitation}
          >
            <AiOutlineUserAdd className="mr-1 text-3xl" />
            Add Friend
          </button>
          <button
            className="hover:scale-105 text-white px-4 py-2 rounded-md flex items-center gap-3 "
            onClick={BlockUser}
          >
            <AiOutlineUserDelete className="mr-1 text-3xl" />
            Block User
          </button>
        </div>
      );
    } else if (relationStatus === "pending") {
      return (
        <div className="w-full px-4 py-2 m-auto">
          <button
            className="hover:scale-105 text-white  py-2 rounded-md flex items-center gap-3 "
            onClick={RemoveFriendInvite}
          >
            <AiOutlineUserDelete className="mr-1 text-3xl" />
            Remove Invitation
          </button>
          <hr className="opacity-50 "></hr>

          <button
            className="hover:scale-105 text-white  py-2 rounded-md flex items-center gap-3 "
            onClick={BlockUser}
          >
            <AiOutlineUserDelete className="mr-1 text-3xl" />
            Block User
          </button>
        </div>
      );
    } else if (relationStatus === "friend") {
      return (
        <div className="w-full p-2 m-auto">
          <button
            className="hover:scale-105 text-white px-4 py-2 rounded-md flex items-center gap-3 "
            onClick={DeleteFriend}
          >
            <AiOutlineUserDelete className="mr-1 text-3xl" />
            Remove Friend
          </button>
          <hr></hr>
          <button
            className="hover:scale-105 text-white px-4 py-2 rounded-md flex items-center gap-3 "
            onClick={BlockUser}
          >
            <AiOutlineUserDelete className="mr-1 text-3xl" />
            Block User
          </button>
        </div>
      );
    } else {
      return (
        <div className="w-full p-2 m-auto">
          <button
            className="hover:scale-105 text-white px-4 py-2 rounded-md flex items-center gap-3 "
            onClick={unblockUser}
          >
            <AiOutlineUserAdd className="mr-1 text-3xl" />
            Unblock
          </button>
        </div>
      );
    }
  };

  const [showFriendRelationMenu, setShowFriendRelationMenu] = useState(false);
  const FriendRelationMenuAnimation = styled.div``;
  const FriendRelationMenuStyle = styled.div`
    animation: 1s ease-in-out;
  `;

  return (
    <div className="  w-[100%] flex flex-col gap-5  ">
      <Top className="top   h-[6rem]   flex  flex-wrap  items-center  gap-10 border-b border-white/50 pb-2 ">
        {user && (
          <Status className="" userStatus={user.status.toLowerCase()}>
            {avatar && <img src={avatar} alt="" className="" />}
          </Status>
        )}
        {user && (
          <div className="description flex flex-col  text-center justify-center ">
            <div className="name md:text-4xl text-xl  font-[800] capitalize ">
              {user.firstName} {user.lastName}
            </div>
            <div className="name  font-[400] ">{user.login}</div>
            <div className="flex gap-10 items-center "></div>
          </div>
        )}

        <div className="gamesInfo  h-full justify-self-stretch flex-1 flex flex-wrap justify-around  gap-2  items-center">
          <div className="gamesNumber flex   items-center gap-4 text-xl font-[600]">
            <img src={Dice} alt="_" width={50} />
            Games : {rankData?.wins + rankData?.loses + rankData?.draws || "_"}
          </div>
          <div className="gamesNumber flex items-center gap-4 text-xl font-[600]">
            <img src={AchivementImg1} width={50} alt="_" />
            Wins : {rankData?.wins || "_"}
          </div>
          <div className="gamesNumber flex items-center gap-4 text-xl font-[600]">
            <img src={Draw} alt="_" width={50} />
            Draw: {rankData?.draws || "_"}
          </div>
          <div className="gamesNumber flex items-center gap-4 text-xl font-[600]">
            <img src={Lose} alt="_" width={50} />
            Lose: {rankData?.loses || "_"}
          </div>
          <div className="relative text-white ">
            {showFriendRelationMenu}
            <CiCircleMore
              className="text-4xl bg-[#434242] rounded-[50%] cursor-pointer hover:scale-105 transition-all"
              onClick={() => {
                setShowFriendRelationMenu(!showFriendRelationMenu);
              }}
            />
            {showFriendRelationMenu && (
              <FriendRelationMenuStyle className="absolute top-12  right-0 bg-[#434242] w-[15rem]   rounded-md shadow-xl shadow-white/10 border z-50">
                {FriendRelatioType()}
              </FriendRelationMenuStyle>
            )}
          </div>
        </div>
      </Top>
      {relationStatus === "blocked" ? (
        <div>Unblocked this user to see his profile</div>
      ) : (
        <Main className="midel flex-1  flex flex-col gap-4 items-center  ">
          <div className="stats  flex gap-6 h-[25rem] w-full   ">
            <div className="friends flex-1  flex flex-col gap-2 rounded-lg border border-gray-300 p-4  h-[25rem] ">
              <div className="top border-b border-white/50  h-[5rem]  ">
                <div className="title text-2xl font-[600] flex  gap-2  items-center ">
                  <img src={FriendsImg} alt="" width={50} />
                  Friends
                </div>
              </div>
              <div className="chanel h-full  py-2 ">
                {friends && friends.length > 0 ? (
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
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                  (e: any, index: number) => (
                    <GameCard key={index} />
                  )
                )}
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
      )}
    </div>
  );
};

export default OtherUserProfile;
