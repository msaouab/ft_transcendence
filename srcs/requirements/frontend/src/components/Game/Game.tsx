import PingPong from "./Canvas";
import styled from "styled-components";
import { useGameContext } from "../../provider/GameProvider";
import { SetStateAction, useEffect, useState } from "react";
import GameProfile from "./GameProfile";
import { useLocation } from "react-router-dom";

const CanvasContainer = styled.div<{ isFirst: Boolean }>`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 1rem;
	border: 1px solid green;
	@media (max-width: 1200px) {
		gap: 0;
		flex-direction: ${({ isFirst }) => (isFirst ? "column-reverse" : "column")};
	}
`;

const PlayerContainer = styled.div<{
	isFirst?: boolean;
	height: number;
	width: number;
}>`
	display: flex;
	align-self: ${({ isFirst }) => (isFirst ? "flex-end" : "flex-start")};
	height: ${({ height }) => height / 1.6}px;
	@media (max-width: 1200px) {
		height: auto;
		align-self: ${({ isFirst }) => (isFirst ? "flex-end" : "flex-start")};
		width: 100%;
	}
`;

const Game = () => {
	const {  typeRoom, modeRoom, mysocket } =
		useGameContext();
	const location = useLocation();
	const { user, benome } = location.state;
	const [score, setScore] = useState({ player1: 0, player2: 0 });

	const payload = {
		type: typeRoom,
		mode: modeRoom,
		width: 700,
		height: 1000,
	};

	useEffect(() => {
		mysocket?.on(
			"responseScore",
			(score: SetStateAction<{ player1: number; player2: number }>) => {
				setScore(score);
			}
		);
		return () => {
			mysocket?.disconnect();
		};
	}, [mysocket]);

	return (
		<CanvasContainer isFirst>
			<PlayerContainer isFirst height={payload.height} width={payload.width}>
				{user && benome ? (
					<GameProfile user={user} isFirst={true} score={score.player1} />
				) : (
					<p>Loading...</p>
				)}
			</PlayerContainer>
			{mysocket ? (
				<PingPong
				/>
			) : (
				<p>Loading...</p>
			)}
			<PlayerContainer height={payload.height} width={payload.width}>
				{benome && user ? (
					<GameProfile user={benome} isFirst={false} score={score.player2} />
				) : (
					<p>Loading...</p>
				)}
			</PlayerContainer>
		</CanvasContainer>
	);
};

export default Game;
