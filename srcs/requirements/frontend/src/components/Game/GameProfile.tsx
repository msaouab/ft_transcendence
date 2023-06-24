import { GetAvatar, getUserInfo } from "../../api/axios";
import styled from "styled-components";
import { useEffect, useState } from "react";
import Moulinete from "../../assets/Moulinette42.jpeg";
import { getAvatarUrl, getAvatarUrlById } from "../common/CommonFunc";
import Cookies from "js-cookie";

interface GameProfileProps {
	user: {
		id: string;
		login: string;
		status: string;
		avatar: string;
	};
	isFirst?: boolean;
	score?: number;
}

const PlayerContainer = styled.div<{ isFirst?: boolean }>`
	display: flex;
	flex-direction: ${({ isFirst }) => (isFirst ? "column" : "column-reverse")};
	align-items: center;
	justify-content: space-between;
	padding: 0.7rem 0;
	.useInfo {
		display: flex;
		flex-direction: ${({ isFirst }) => (isFirst ? "row-reverse" : "row")};
		align-items: center;
		gap: 10px;
		.circle-image {
			/* max-width: 100%; */
			box-sizing: border-box;
			width: 50px;
			height: 50px;
			border-radius: 50%;
			object-fit: cover;
		}
	}
	@media (max-width: 1200px) {
		padding: 0;
		justify-content: space-around;
		align-items: center;
		width: 100%;
		flex-direction: ${({ isFirst }) => (isFirst ? "row-reverse" : "row")};
		.score {
			font-size: 3rem;
			line-height: normal;
		}
	}
`;

const ScoreContainer = styled.div`
	font-size: 5rem;
	line-height: 0;
	@media (max-width: 1200px) {
		/* font-size: 3rem; */
	}
`;

const GameProfile = ({ user, isFirst, score }: GameProfileProps) => {
	const [userInfos, setUserInfos] = useState<any>({} as any);

	useEffect(() => {
		if (user.id === "Bot") user.avatar = Moulinete;
	}, [user]);

	return (
		<PlayerContainer isFirst={isFirst}>
			<ScoreContainer className="score">{score}</ScoreContainer>
			<div className="useInfo">
				<img src={user?.avatar} alt="avatar" className="circle-image" />
				<p className="login">{user.login}</p>
			</div>
		</PlayerContainer>
	);
};

export default GameProfile;
