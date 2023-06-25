import { Link, useNavigate } from "react-router-dom";
import RoundTable from "../../assets/roundTable.png";
import TimingTable from "../../assets/timeTable.png";
import GetChallenge from "../../assets/getChallenge.png";
import Avatar from "../../assets/avatar.png";
import SwiperComponent from "../../components/common/Slider";
import PlayWithMe from "../../assets/playWithMe.png";
import GameImg from "../../assets/gameImg.png";
import { useGameContext } from "../../provider/GameProvider";
import styled from "styled-components";
import { useGlobalContext } from "../../provider/AppContext";
import { useEffect, useState } from "react";
import {
	GetAvatar,
	getGameHistory,
	getInviteGame,
	getLiveGame,
	getUserInfo,
} from "../../api/axios";

const chalenger = [
	{
		name: "Ilyass",
		compus: "1337 KH",
	},
	{
		name: "koko",
		compus: "1337 BG",
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

const Main = styled.div`
	@media (max-width: 1200px) {
		flex-direction: column;
		.stats {
			height: unset;
			min-height: fit-content;
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;
			& > div {
				max-width: 70%;
				min-width: 360px;
				max-height: 500px;
			}
		}
		.achievements {
			width: 70%;
			.achiv-container {
				display: flex;
				flex-direction: column;
			}
		}
	}
	@media (max-width: 850px) {
		flex-direction: column;
		.stats {
			height: unset;
			min-height: fit-content;
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;
			& > div {
				max-width: 90%;
				min-width: 360px;
				max-height: 500px;
			}
		}
		.achievements {
			width: 90%;
			.achiv-container {
			}
		}
	}
`;

interface ChalengerCardProps {
	name: string;
}

export const ChalengerCard = ({ id, login, roomID, type, mode }: any) => {
	const navigate = useNavigate();
	const [userImg, setUserImg] = useState<string>("");
	const [user, setUser] = useState<any>({});
	const [Benome, setBenome] = useState<any>({});
	const { typeRoom, modeRoom, friend, setFriend, setTypeRoom, setModeRoom } =
		useGameContext();

	useEffect(() => {
		// setFriend(id);
		if (type && mode && id) {
			setTypeRoom(type);
			localStorage.setItem("typeRoom", type);
			setModeRoom(mode);
			localStorage.setItem("modeRoom", mode);
			setFriend(id);
		}
		const getAvatarImg = async (id: string) => {
			const userImg = await GetAvatar(id);
			setUserImg(userImg || "");
		};
		const getUser = async (id: string) => {
			const userInfo = await getUserInfo(id);
			setUser(userInfo);
		};
		// getAvatarImg(id);
		getUser(id);
		return () => {
			setUserImg("");
		};
	}, []);

	return (
		<div className="flex p-2 gap-4 items-center bg-white rounded-lg text-gray-600 relative shadow-sm shadow-white min-h-[5rem]">
			<div className="image">
				<img
					src={user.avatar}
					alt=""
					width={45}
					className="box-border rounded-full aspect-square"
				/>
			</div>
			<div className="name text-2xl font-[800]">{login}</div>
			<div className="status justify-self-end absolute right-3 flex gap-1  items-center">
				<button
					onClick={() => {
						navigate(`/game/startGame`, {});
					}}
					className="flex gap-2 items-center m-1 border border-gray-500 rounded-md p-2 hover:scale-105 transition-all shadow-md"
				>
					challenge <img src={PlayWithMe} alt="" width={20} />
				</button>
				{/* <div className="dot w-3 h-3 bg-green-500 rounded-full"></div> */}
			</div>
		</div>
	);
};

const HistoryCard = ({ history }: any) => {
	const { player1_id, player2_id, player1_pts, player2_pts } = history;
	const [userImg, setUserImg] = useState<string>("");
	const [user, setUser] = useState<any>({});
	const [Benome, setBenome] = useState<any>({});

	useEffect(() => {
		const getAvatarImg = async (id: string) => {
			const userImg = await GetAvatar(id);
			setUserImg(userImg || "");
		};
		const getUser = async (id1: string, id2: string) => {
			const userInfo = await getUserInfo(id1);
			if (userInfo) setUser(userInfo);
			const benomeInfo = await getUserInfo(id2);
			if (benomeInfo) setBenome(benomeInfo);
		};
		// getAvatarImg(player1_id);
		getUser(player1_id, player2_id);
		return () => {
			setUserImg("");
		};
	}, []);

	return (
		<div className="flex justify-between p-2 gap-4 items-center bg-white rounded-lg text-gray-600 relative shadow-sm shadow-white min-h-[5rem]">
			<div className="user flex justify-center items-center gap-2 ">
				<div className="image w-[45px]">
					<img
						src={user.avatar}
						alt=""
						className="box-border rounded-full aspect-square w-[100%]"
					/>
				</div>
				<div className="name text-xl font-[500]">{user.login}</div>
			</div>
			<div className="score flex gap-5 text-deep-orange-500">
				<div className="text-2xl font-[700]">{player1_pts}</div>
				<p className="border-t-[3px]"> - </p>
				<div className="text-2xl font-[700]">{player2_pts}</div>
			</div>
			<div className="benome flex justify-center items-center gap-2">
				<div className="name text-xl font-[500]">{Benome.login}</div>
				<div className="image w-[45px]">
					<img
						src={Benome.avatar}
						alt=""
						width={45}
						className="box-border rounded-full aspect-square"
					/>
				</div>
			</div>
		</div>
	);
};

interface GameCardProps {
	title: string;
	description: string;
	imgPath: string;
	game: any;
}

const GameCard = (props: GameCardProps) => {
	const navigate = useNavigate();
	const { title, description, imgPath, game } = props;
	const [userImg, setUserImg] = useState<string>("");
	const [user, setUser] = useState<any>({});
	const [Benome, setBenome] = useState<any>({});
	const { player1_id, player2_id, player1_pts, player2_pts } = game;
	useEffect(() => {
		const getAvatarImg = async (id: string) => {
			const userImg = await GetAvatar(id);
			setUserImg(userImg || "");
		};
		const getUser = async (id1: string, id2: string) => {
			const userInfo = await getUserInfo(id1);
			if (userInfo) setUser(userInfo);
			const benomeInfo = await getUserInfo(id2);
			if (benomeInfo) setBenome(benomeInfo);
		};
		// getAvatarImg(player1_id);
		getUser(player1_id, player2_id);
		return () => {
			setUserImg("");
		};
	}, []);
	return (
		<div className="h-full p-5 flex justify-center w-full ">
			<div
				className=" w-full md:max-w-[300px] cursor-pointer bg-white shadow-gray-400/50 shadow-md rounded-lg p-2 text-gray-700 flex flex-col gap-4 justify-center items-center hover:scale-105 transition-all duration-200 h-full"
				// onClick={() => {
				// 	navigate(`/game/startGame`, {});
				// }}
			>
				<div className="image border-deep-purple-400 border-4 rounded-[50%] p-8">
					<img src={imgPath} alt="" width={100} className="max-w-[100%]" />
				</div>
				<div className="flex justify-between gap-3 items-center w-[95%] md:flex-wrap">
					<div className="player1">{user.login}</div>
					<div className="score flex gap-1 md:flex-wrap">
						<span className="">{player2_pts}</span>-
						<span className="">{player2_pts}</span>
					</div>
					<div className="player2">{Benome.login}</div>
				</div>
			</div>
		</div>
	);
};
// flex flex-col justify-center items-center md:flex md:flex-row  md:justify-between w-[95%] text-xl font-bold border border-black/40 shadow-sm p-2 rounded-md

const GameDashboard = () => {
	const { setTypeRoom } = useGameContext();
	const { setGameNotif } = useGlobalContext();
	const handleLinkClick = (table: string) => {
		localStorage.setItem("typeRoom", table);
		setTypeRoom(table);
	};
	interface Iitem {
		id: number;
		login?: string;
		roomId?: string;
		type?: string;
		mode?: string;
	}
	interface history {
		player1: string;
		player2: string;
		player1_score: number;
		player2_score: number;
	}
	const [info, setInfo] = useState<Iitem[]>([]);
	const [history, setHistory] = useState<history[]>([]);
	const [liveGames, setLiveGames] = useState<history[]>([]);

	useEffect(() => {
		const fetchUserInfo = async (
			senderId: string,
			roomId: string,
			mode: string,
			type: string
		): Promise<Iitem> => {
			const userInfo = await getUserInfo(senderId);
			const transformedInfo: Iitem = {
				id: userInfo.id,
				login: userInfo.login,
				roomId: roomId,
				type: type,
				mode: mode,
			};
			return transformedInfo;
		};

		const fetchAllUserInfo = async (): Promise<void> => {
			const invites = await getInviteGame();

			const userPromises = invites.map(
				(invite: {
					sender_id: string;
					roomId: string;
					mode: string;
					type: string;
				}) =>
					fetchUserInfo(
						invite.sender_id,
						invite.roomId,
						invite.mode,
						invite.type
					)
			);

			try {
				const userData = await Promise.all(userPromises);
				setInfo(userData);
			} catch (error) {
				console.error("Error fetching user info:", error);
			}
		};
		fetchAllUserInfo();
		setGameNotif(0);
	}, []);

	useEffect(() => {
		const fetchAllHistoryGames = async (): Promise<void> => {
			const games = await getGameHistory();
			setHistory(games.reverse());
		};
		const fetchAllLiveGames = async (): Promise<void> => {
			const games = await getLiveGame();
			setLiveGames(games);
		};

		fetchAllHistoryGames();
		fetchAllLiveGames();
	}, []);

	return (
		<div className="  w-[100%] flex flex-col gap-5  ">
			<Main className="midel flex-1  flex flex-col gap-4 items-center  ">
				<div className="stats  flex gap-6 h-[25rem] w-full   ">
					<div className="friends flex-1  flex flex-col gap-2 rounded-lg border border-gray-300 p-4 h-[100%] h-[25rem] ">
						<div className="top border-b border-white/50  h-[5rem]  ">
							<div className="title text-white font-semibold text-xl flex gap-4 items-center mb-4">
								<img src={GetChallenge} alt="" width={50} />
								Choose your game type
							</div>
						</div>
						<div className="chanel h-full  py-2 ">
							<div className="flex-1 flex items-center gap-5  ">
								<Link
									to="/game-type"
									className="  left flex-1 h-[80%] w-full flex flex-col justify-center items-center  cursor-pointer "
									onClick={() => handleLinkClick("Round")}
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
									onClick={() => handleLinkClick("Time")}
								>
									<GameTypeCard
										title="Timing Table"
										description="Play Aainst "
										imgPath={TimingTable}
									/>
								</Link>
							</div>
						</div>
					</div>
					<div className="chanels flex-1  flex flex-col gap-2 rounded-lg border border-gray-300 p-4 h-[25rem]">
						<div className="top border-b border-white/50  h-[5rem]  ">
							<div className="title text-white font-semibold text-xl flex gap-4 items-center mb-4">
								<img src={GetChallenge} alt="" width={50} />
								Get your challenge
							</div>
						</div>
						<div className="chanel h-full overflow-y-scroll py-2 flex flex-col gap-2">
							{info && info.length ? (
								// <div className="flex flex-col  gap-5 mr-1 h-full ">
								info.map((item: Iitem, index: any) => (
									<ChalengerCard
										key={index}
										id={item.id}
										login={item.login}
										roomID={item.roomId}
										type={item.type}
										mode={item.mode}
									/>
								))
							) : (
								// </div>
								<div className=" h-full flex justify-center items-center text-3xl">
									No Chalenger
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
							{history && history.length > 0 ? (
								<div className="flex flex-col  gap-5 mr-1 h-full ">
									{history.map((history, index) => (
										<HistoryCard key={index} history={history} />
									))}
								</div>
							) : (
								<div className=" h-full flex justify-center items-center text-3xl">
									No Chalenger
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="achievements border border-gray-300-100 rounded-xl p-4   h-[40%]  lg:w-[70%] w-full  m-auto">
					<div className="title bo text-4xl mb-4 font-[600]   gap-2  items-center flex-1 text-center underline flex justify-center ">
						Live Games
					</div>
					<div className="achiv-container flex justify-center items-center gap-10   m-auto min-h-[15rem] ">
						{liveGames ? (
							<div className="h-[90%] w-full ">
								<SwiperComponent
									slides={
										liveGames.map((game, index) => (
											<GameCard
												key={index}
												game={game}
												title="Achivement 1"
												description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."
												imgPath={GameImg}
											/>
										)) as any
									}
									// slides={Array(10).fill(
									// 	<GameCard
									// 		title="Achivement 1"
									// 		description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."
									// 		imgPath={GameImg}
									// 	/>
									// )}
								></SwiperComponent>
							</div>
						) : (
							<div className=" h-full flex justify-center items-center text-3xl text-center">
								No Live Games
							</div>
						)}
					</div>
				</div>
			</Main>
		</div>
	);
};

export default GameDashboard;
