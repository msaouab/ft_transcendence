import { useGlobalContext } from "../../provider/AppContext";
import styled from "styled-components";

interface GameProfileProps {
    data: {
        id: string;
		login: string;
		status: string;
	};
	isFirst?: boolean;
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
`;

const ScoreContainer = styled.div`
	font-size: 5rem;
	line-height: 0;
`;

const GameProfile = ({ data, isFirst }: GameProfileProps) => {
	const { userImg } = useGlobalContext();
	return (
		<PlayerContainer isFirst={isFirst}>
			<ScoreContainer>0</ScoreContainer>
			<div className="useInfo">
				<img src={userImg} alt="avatar" width={60} />
				<p className="login">{data.login}</p>
			</div>
		</PlayerContainer>
	);
};

export default GameProfile;
