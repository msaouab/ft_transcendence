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
import { getFriendsInfo, getUserInfo } from "../../api/axios";

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

interface ChalengerCardProps {
	name: string;
}

export const ChalengerCard = ({
	id,
	img,
	login,
	fname,
	lname,
	status,
	roomID,
}: any) => {
	const navigate = useNavigate();
	// const { login } = props;
	return (
		<div className="flex p-2 gap-4 items-center bg-white rounded-lg text-gray-600 relative shadow-sm shadow-white	min-h-[5rem]">
			<div className="image">
				<img src={Avatar} alt="" width={60} />
			</div>
			<div className="name text-2xl font-[800]">{login}</div>
			<div className="status justify-self-end absolute right-3 flex gap-1  items-center">
				<button
					onClick={() => {
						navigate(`/game/${roomID}`);
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

interface GameCardProps {
	title: string;
	description: string;
	imgPath: string;
}

const GameCard = (props: GameCardProps) => {
	const { title, description, imgPath } = props;
	return (
		<div className="h-full p-5 flex justify-center w-full  ">
			<div className=" debug w-full md:max-w-[350px] cursor-pointer bg-white shadow-gray-400/50 shadow-md rounded-lg p-2 text-gray-700 flex flex-col gap-4 justify-center items-center hover:scale-105 transition-all duration-200 h-full">
				<div className="image border-deep-purple-400 border-4 rounded-[50%] p-8">
					<img src={imgPath} alt="" width={100} className="max-w-[100%]" />
				</div>
				<div className="flex flex-col justify-center items-center md:flex md:flex-row  md:justify-between  w-[80%] text-xl font-bold border border-black/40 shadow-sm p-2 rounded-md ">
					Moha
					<span>1 - 2</span>
					Ilyass
				</div>
			</div>
		</div>
	);
};

const GameDashboard = () => {
	const { setTypeRoom } = useGameContext();
	const { gameNotif, setGameNotif } = useGlobalContext();
	const handleLinkClick = (table: string) => {
		localStorage.setItem("typeRoom", table);
		setTypeRoom(table);
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
		key?: string;
	}
	const [friend, setFriend] = useState<Iitem[]>([]);

	useEffect(() => {
		// const chellenge = Cookies.get("friendChellenge");
		const chellenge = JSON.parse(
			window.localStorage.getItem("friendChellenge")!
		);
		// console.log("chellenge:", chellenge);
		const getChellenger = async () => {
			try {
				const updatedFriends = await Promise.all(
					chellenge.map(async (elem: any) => {
						const friends = await getUserInfo(elem.id);
						return { ...friends, key: elem.key }; // Include the key value from chellenge
					})
				);
				setFriend((prev) => [...prev, ...updatedFriends]);
				setGameNotif(0);
				// console.log("friends:", friend)
			} catch (error) {
				console.error(error);
			}
		};
		// const getChellenger = async () => {
		// 	try {
		// 		chellenge.forEach(async (elem: any) => {
		// 			const friends = await getUserInfo(elem.id);
		// 			setFriend((prev) => [...prev, friends]);
		// 			console.log("friends:", friend);
		// 		});
		// 	} catch (error) {
		// 		console.error(error);
		// 	}
		// };
		if (chellenge) getChellenger();
	}, []);

	// console.log("friendChellenge:", friend);
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
				/* height: 500px; */
				/* width: 100%; */
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
				/* height: 500px; */
				/* max-width: 90%;
        min-width: 360px;
        max-height: 500px; */
				width: 90%;
				.achiv-container {
					/* display: flex;
          flex-direction: column;
          width: unset;
          max-width: 90%; */
				}
			}
		}
	`;
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
							{friend && friend.length ? (
								// <div className="flex flex-col  gap-5 mr-1 h-full ">
								friend.map((item: Iitem, index: any) => (
									<ChalengerCard
										key={index}
										id={item.id}
										img={item.avatar}
										login={item.login}
										fname={item.firstName}
										lname={item.lastName}
										status={item.status}
										roomID={item.key}
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
							{true ? (
								<div className="flex flex-col  gap-5 mr-1 h-full ">
									{chalenger.map((chalenger, index) => (
										<ChalengerCard key={index} name={chalenger.name} />
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
					<div className="achiv-container flex justify-center items-center gap-10   m-auto min-h-[15rem]">
						{false ? (
							<div className="h-[90%] w-full ">
								<SwiperComponent
									slides={Array(10).fill(
										<GameCard
											title="Achivement 1"
											description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum."
											imgPath={GameImg}
										/>
									)}
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
