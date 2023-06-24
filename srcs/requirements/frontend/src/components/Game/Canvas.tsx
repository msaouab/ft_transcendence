import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
// import { Socket } from "mysocket?.io-client";
import { useGameContext } from "../../provider/GameProvider";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface PingPongProps {
	width: number;
	height: number;
	// socket: Socket;
}

type PlayerState = {
	x: number;
	y: number;
	width: number;
	height: number;
};

type BallState = {
	x: number;
	y: number;
	r: number;
	dx: number;
	dy: number;
	speed: number;
	c: string;
};

const PlayGround = styled.div`
	display: flex;
	justify-content: center;
	gap: 2rem;
	align-items: center;
`;

// const ScoreContainter = styled.div`
// 	display: flex;
// 	flex-direction: column;
// 	justify-content: space-between;
// 	align-items: center;
// 	width: 50%;
// 	.score {
// 		font-size: 5rem;
// 		font-weight: bolder;
// 		color: white;
// 	}
// `;

let ctx: CanvasRenderingContext2D | null;

const PingPong = () => {
	const navigate = useNavigate();
	const { modeRoom, mysocket } = useGameContext();
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [player1X, setPlayer1X] = useState<PlayerState>({} as PlayerState);
	const [player2X, setPlayer2X] = useState<PlayerState>({} as PlayerState);
	const [ball, setBall] = useState<BallState>({} as BallState);

	useEffect(() => {
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			const width = canvas.clientWidth;
			const height = canvas.clientHeight;
			ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.beginPath();
				ctx.fillStyle = "#000000";
				ctx.fillRect(0, 0, width, height);
				ctx.fill();
				// midline
				ctx.setLineDash([10, 15]);
				ctx.moveTo(0, height / 2);
				ctx.lineTo(width, height / 2);
				ctx.strokeStyle = "#fff";
				ctx.stroke();
				ctx.closePath();
				// player
				drawPlayer(player1X);
				drawPlayer(player2X);
				// ball
				drawBall(ball);
			}
		}
		return () => {
			ctx = null;
		};
	}, [player1X, player2X, ball]);

	useEffect(() => {
		const resize = () => {
			const canvas = canvasRef.current;
			if (!canvas) return;
			const { clientWidth } = canvas;
			const calculatedHeight = (clientWidth * 16) / 9;
			canvas.width = clientWidth;
			canvas.height = calculatedHeight;
		};

		window.addEventListener("resize", resize);
		resize();
		return () => {
			window.removeEventListener("resize", resize);
		};
	}, []);

	const drawPlayer = (player: PlayerState) => {
		if (ctx) {
			ctx.fillStyle = ball.c;
			ctx.fillRect(player.x, player.y, player.width, player.height);
			ctx.fill();
		}
	};

	useEffect(() => {
		const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
			const clientX = e.clientX - 40;
			const clientY = e.clientY;
			const canvas = canvasRef.current;
			if (!canvas) return;
			const serverWidth = 700;
			const clientWidth = canvasRef.current!.clientWidth;
			const scaleX = clientWidth / serverWidth;
			const rect = canvas.getBoundingClientRect();
			const x = (clientX) / scaleX - rect.left;
			const y = (clientY - rect.top);
			const data = {
				x: x,
				y: y,
				userId: Cookies.get("userid"),
			};
			if (modeRoom === "Bot") mysocket?.emit("requesteBot", data);
			else mysocket?.emit("requesteMouse", data);
		};
		document.addEventListener(
			"mousemove",
			handleMouseMove as unknown as EventListener
		);
		mysocket?.on("responseMouse", (playerPosition) => {
			const serverWidth = 700;
			const serverHeight = (serverWidth * 16) / 9;
			const clientWidth = canvasRef.current!.clientWidth;
			const clientHeight = (clientWidth / serverWidth) * serverHeight;
			const scaleX = clientWidth / serverWidth;
			const scaleY = clientHeight / serverHeight;
			playerPosition.x = playerPosition.x * scaleX;
			playerPosition.y = playerPosition.y * scaleY;
			setPlayer1X(playerPosition);
		});
		mysocket?.on("responsePlayer2", (playerPosition) => {
			const serverWidth = 700;
			const serverHeight = (serverWidth * 16) / 9;
			const clientWidth = canvasRef.current!.clientWidth;
			const clientHeight = (clientWidth / serverWidth) * serverHeight;
			// const clientHeight = canvasRef.current!.clientHeight;
			const scaleX = clientWidth / serverWidth;
			const scaleY = clientHeight / serverHeight;
			playerPosition.x = playerPosition.x * scaleX;
			playerPosition.y = playerPosition.y * scaleY;
			setPlayer2X(playerPosition);
		});

		return () => {
			document.removeEventListener(
				"mousemove",
				handleMouseMove as unknown as EventListener
			);
			mysocket?.off("responseMouse");
			mysocket?.off("responsePlayer2");
		};
	}, [mysocket, player1X, player2X, ball]);

	const drawBall = (ball: BallState) => {
		if (ctx) {
			// ctx.beginPath();
			ctx.fillStyle = ball.c; // ball color
			ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, true); // draw ball
			ctx.fill();
			// ctx.closePath();
		}
	};

	useEffect(() => {
		mysocket?.on("StartTime", (time) => {});
		mysocket?.on("responseBall", (ball) => {
			const serverWidth = 700;
			const serverHeight = (serverWidth / 16) * 9;
			const clientWidth = canvasRef.current!.clientWidth;
			const clientHeight = (clientWidth / serverWidth) * serverHeight;

			const widthScale = clientWidth / serverWidth;
			const heightScale = clientHeight / serverHeight;

			ball.x = ball.x * widthScale;
			ball.y = ball.y * heightScale;
			setBall(ball);
		});
		mysocket?.on("responseWinner", (winner) => {
			navigate("/game");
		});
		return () => {
			mysocket?.off("responseBall");
		};
	}, [mysocket, ball]);

	return (
		<PlayGround className=" w-full max-w-[683px]">
			<canvas id="myCanvas" ref={canvasRef} className="w-full" />
		</PlayGround>
	);
};

export default PingPong;
