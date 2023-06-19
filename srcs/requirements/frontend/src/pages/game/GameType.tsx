import GameImg from "../../assets/gameImg.png";
import Avatar from "../../assets/avatar.png";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "../../provider/GameProvider";
import { Dialog } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { getFriendsInfo, GetAvatar, getRankData } from "../../api/axios";
import { useGlobalContext } from "../../provider/AppContext";
import NoFriendsImg from "../../assets/noFriends.png";
import styled from "styled-components";
import PlayWithMe from "../../assets/playWithMe.png";
import { IoCloseCircleSharp } from "react-icons/io5";

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

const FreindCard = ({ id, img, login, fname, lname, status }: any) => {
	const navigate = useNavigate();
	const { setFriend, typeRoom, modeRoom, friend } = useGameContext();
	const [userImg, setUserImg] = useState<string>("");
	const [rankData, setRankData] = useState<any>({});
	const payload = {
		type: typeRoom,
		mode: modeRoom,
		friend: friend,
		width: 700,
		height: 1000,
	};
	useEffect(() => {
		const getAvatarImg = async (id: string) => {
			const userImg = await GetAvatar(id);
			setUserImg(userImg || "");
		};
		const getRankUser = async (id: string) => {
			const rank = await getRankData(id);
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
		<div className="flex justify-around w-full text-black flex-wrap gap-6">
			<div className="flex gap-2">
				<img
					src={userImg}
					alt="frindImg"
					width={40}
					className=" w-9 aspect-square rounded-full "
				/>
				<div className="flex justify-center items-center">{login}</div>
			</div>
			<div className="flex justify-center items-center">
				<button
					className="flex items-center border gap-2 p-1"
					onClick={() => {
						setFriend(id);
						navigate("/game/startGame", payload);
					}}
					disabled={status !== "Online"}
				>
					challenge <img src={PlayWithMe} alt="challenge-btn" width={20} />
				</button>
			</div>
		</div>
	);
};

const GameType = () => {
	const { setModeRoom, modeRoom } = useGameContext();
	const { userId } = useGlobalContext();

	const navigate = useNavigate();
	const handleModeGame = (benome: string) => {
		console.log("benome: ", benome)
		localStorage.setItem("typeRoom", benome);
		setModeRoom(benome);
	};
	const [open, setOpen] = useState(false);
	const handelOpen = () => {
		setOpen(!open);
	};

	const [friends, setFriends] = useState([]);
	const getFriendsData = () => {
		getFriendsInfo(userId || "").then((res) => {
			setFriends(res);
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
			<div
				className={`${
					open
						? " absolute top-0 left-0 h-full w-full bg-white/30 to-blue-gray-300 z-40 flex justify-center items-center "
						: "hidden"
				}`}
				onClick={handelOpen}
			>
				<div className="flex-col gap-5 w-[300px] bg-white flex justify-center items-center relative shadow-lg rounded-md z-50 py-5 max-h-64 overflow-y-auto">
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
							/>
						))
					) : (
						<div className="flex flex-col gap-5  justify-center items-center">
							<ImgAnimation
								src={NoFriendsImg}
								alt=""
								width={150}
								className=""
							/>
							<h1 className="text-2xl font-bold text-gray-700 ">No Friends</h1>
						</div>
					)}
				</div>
			</div>
			<div className="game-type w-full flex justify-around flex-wrap p-2 m-auto md:min-h-[20rem] max-w-[1300px]">
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
							className="w-[90%] scale-75 md:scale-100 m-auto h-[90%] cursor-pointer"
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
		</div>
	);
};

export default GameType;
