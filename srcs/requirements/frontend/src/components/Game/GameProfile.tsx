import { useGlobalContext } from "../../provider/AppContext";
import styled from "styled-components";

interface GameProfileProps {
    data: {
        id: string;
		login: string;
		status: string;
	};
	isFirst?: boolean;
	score?: number;
}

const PlayerContainer = styled.div<{ isFirst?: boolean }>`
	display: flex;
	flex-direction: ${({ isFirst }) => (isFirst ? "column" : "column-reverse")};
	align-items: center;
	justify-content: space-between;
	padding: .7rem 0;
	.useInfo {
		display: flex;
		flex-direction: ${({ isFirst }) => (isFirst ? "row-reverse" : "row")};
		align-items: center;
		gap: 10px;
		img {
			max-width: 100%;
			box-sizing: border-box;
			width: 50px;
			border-radius: 50%;
		}
	}
	@media (max-width: 1200px) {
		flex-direction: row;
		padding: 0;
		justify-content: space-around;
		align-items: center;
		border: 1px solid red;
		width: 100%;
		flex-direction: ${({ isFirst }) => (isFirst ? "row" : "row-reverse")};
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

const GameProfile = ({ data, isFirst, score }: GameProfileProps) => {
	const { userImg } = useGlobalContext();
	return (
		<PlayerContainer isFirst={isFirst}>
			<ScoreContainer className="score">{score}</ScoreContainer>
			<div className="useInfo">
				<img src={userImg} alt="avatar" width={60} />
				<p className="login">{data.login}</p>
			</div>
		</PlayerContainer>
	);
};

export default GameProfile;
