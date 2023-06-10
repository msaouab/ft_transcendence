import GameImg from "../../assets/gameImg.png";
import Avatar from "../../assets/avatar.png";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../provider/GameProvider";
import { Dialog } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { getFriendsInfo, GetAvatar, getRankData } from "../../api/axios";
import { useGlobalContext } from "../../provider/AppContext";
import NoFriendsImg from "../../assets/noFriends.png";
import styled from "styled-components";
import PlayWithMe from "../../assets/playWithMe.png";

const Games = [
	{
		id: 1,
		name: "Bot",
		icon: "fas fa-robot",
	},
	{
		id: 2,
		name: "Friend",
		icon: "fas fa-user",
	},
	{
		id: 3,
		name: "Random",
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

const FreindCard = ({ id, img, login, fname, lname }: any) => {
	const navigate = useNavigate();
	const { setFriend } = useAppContext();
	console.log("freind card:", id, img, login, fname, lname);
	const [userImg, setUserImg] = useState<string>("");
	const [rankData, setRankData] = useState<any>({});
	useEffect(() => {
		const getAvatarImg = async (id: string) => {
			const userImg = await GetAvatar(id);
			setUserImg(userImg);
		};
		const getRankUser = async (id: string) => {
			const rank = await getRankData(id);
			console.log(id, rank);
			setRankData(rank);
		};
		getAvatarImg(id);
		getRankUser(id);
		return () => {
			setUserImg("");
			setRankData({});
		};
	}, [id]);
	return (
		<div className="flex justify-evenly">
			<div className="flex ">
				<img
					src={userImg}
					alt="frindImg"
					width={40}
					className=""
				/>
				<div className="">{login}</div>
			</div>
			<div className=" ">
				<button className="flex items-center border"
					onClick={() => {
						setFriend(id);
						console.log("friend id:", id);
						navigate("/game/startGame");
					}}
				>
					challenge <img src={PlayWithMe} alt="challenge-btn" width={20} />
				</button>
			</div>
		</div>
	);
};

const GameType = () => {
	const { setModeRoom, modeRoom } = useAppContext();
	const { userId } = useGlobalContext();

	const navigate = useNavigate();
	const handleModeGame = (benome: string) => {
		localStorage.setItem("typeRoom", benome);
		setModeRoom(benome);
	};
	const [open, setOpen] = useState(false);
	const [imgPreview, setImgPreview] = useState("");
	const handelOpen = () => {
		setOpen(!open);
	};

	const [friends, setFriends] = useState([]);
	const getFriendsData = () => {
		getFriendsInfo(userId || "").then((res) => {
			setFriends(res);
			console.log(res[0]);
		});
	};

	interface Iitem {
		id: number;
		name: string;
		icon: string;
		avatar?: string;
		login?: string;
		firstName?: string;
		lastName?: string;
		status?: string;
	}

	const ImgAnimation = styled.img`
		animation: bounce 2s infinite;
		@keyframes bounce {
			0% {
				transform: translateY(0);
			}
			50% {
				transform: translateY(-5px);
			}
			100% {
				transform: translateY(0);
			}
		}
	`;

	return (
		<div className="h-full w-full flex flex-col items-center gap-5">
			<Dialog
				size="xs"
				open={open}
				handler={handelOpen}
				className="flex-col gap-5"
			>
				{friends && friends.length ? (
					friends.map((item: Iitem, index) => (
						<FreindCard
							key={index}
							id={item.id}
							img={item.avatar}
							login={item.login}
							fname={item.firstName}
							lname={item.lastName}
							status={item.status}
							// points="1337"
						/>
					))
				) : (
					<div className="flex flex-col gap-5  justify-center items-center">
						<ImgAnimation src={NoFriendsImg} alt="" width={150} className="" />
						<h1 className="text-2xl font-bold ">No Friends</h1>
					</div>
				)}
			</Dialog>
			<div className="game-type w-full  flex justify-around flex-wrap p-2 m-auto md:min-h-[20rem] max-w-[1300px]">
				{Games.map((item) => (
					<div
						key={item.id}
						className="w-[18rem]"
						onClick={() => {
							if (item.id === 2) {
								handelOpen();
								getFriendsData();
							} else navigate("/game/startGame");
							handleModeGame(item.name);
						}}
					>
						<div
							className="w-[90%] scale-75 md:scale-100 m-auto h-[90%]"
							key={item.id}
						>
							<GameTypeCard
								title={item.name}
								description={item.name}
								imgPath={GameImg}
							/>
						</div>
					</div>
				))}
			</div>
			{/* <div className="rank flex justify-center h-[30rem] w-full gap-10 ">
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
      </div> */}
		</div>
	);
};

export default GameType;
