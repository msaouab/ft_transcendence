import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

interface PingPongProps {
	width: number;
	height: number;
	socket: Socket;
}

const PlayGround = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const ScoreContainter = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 50%;
	.score {
		font-size: 5rem;
		font-weight: bolder;
		color: white;
	}
`;

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

let ctx: CanvasRenderingContext2D | null;

const PingPong = ({ width, height, socket }: PingPongProps) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [score, setScore] = useState({ player1: 0, player2: 0 });
	const [player1X, setPlayer1X] = useState<PlayerState>({
		x: width / 2 - 40,
		y: height - 20,
		width: 80,
		height: 10,
	});
	const [player2X, setPlayer2X] = useState<PlayerState>({
		x: width / 2 - 40,
		y: 10,
		width: 80,
		height: 10,
	});
	const [ball, setBall] = useState({
		x: width / 2,
		y: height / 2,
		r: 10,
		dx: 1,
		dy: 1,
		speed: 4,
		c: "#fff",
	});

	useEffect(() => {
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.beginPath();
				ctx.fillStyle = "#000";
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
			const rect = canvas.getBoundingClientRect();
			const x = clientX - rect.left;
			const y = clientY - rect.top;
			const data = {
				x: x,
				y: y,
				height: height,
				width: width,
				// player1X: player1X,
				// player2X: player2X,
			};
			socket.emit("requesteMouse", data);
		};
		document.addEventListener("mousemove", handleMouseMove as unknown as EventListener);
		socket.on("responseMouse", (playerPosition) => {
			setPlayer1X(playerPosition);
		});
		socket.on("responsePlayer2", (playerPosition) => {
			setPlayer2X(playerPosition);
		});
		return () => {
			document.removeEventListener("mousemove", handleMouseMove as unknown as EventListener);
			socket.off("responseMouse");
			socket.off("responsePlayer2");
		};
	}, [socket, player1X, player2X, height, width]);

	//	render the ball and get the new position of the ball from the server

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
		socket.on("StartTime", (time) => {
			console.log(time);
		});
		socket.on("responseBall", (ball, score) => {
			setBall(ball);
			setScore(score);
		});
		socket.on("responseWinner", (winner) => {
			console.log(winner);
		});
		return () => {
			socket.off("responseBall");
		};
	}, [ socket, ball]);

	return (
		<PlayGround className="">
			{/* <div>{time}</div> */}
			<canvas ref={canvasRef} width={width} height={height} />
			<ScoreContainter>
				<div className="score">P1: {score.player1}</div>
				<div className="score">P2: {score.player2}</div>
			</ScoreContainter>
		</PlayGround>
	);
};

export default PingPong;
