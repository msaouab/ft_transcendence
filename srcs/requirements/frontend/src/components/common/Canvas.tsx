import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Socket } from "socket.io-client";

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

interface PingPongProps {
	width: number;
	height: number;
	socket: Socket;
}

type PlayerState = {
	width: number;
	height: number;
	x: number;
	y: number;
};

type BallState = {
	x: number;
	y: number;
	r: number;
	c: string;
	vx: number;
	vy: number;
};

let ctx: CanvasRenderingContext2D | null;

const drawPlayer = (player: PlayerState) => {
	if (ctx) {
		ctx.fillStyle = "#fff";
		ctx.fillRect(player.x, player.y, player.width, player.height);
		ctx.fill();
	}
};

const drawBall = (ball: BallState) => {
	if (ctx) {
		ctx.beginPath();
		ctx.fillStyle = ball.c; // ball color
		ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, true); // draw ball
		ctx.fillStyle = "#fff";
		ctx.fill();
		ctx.closePath();
	}
};

const PingPong = ({ width, height, socket }: PingPongProps) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [score, setScore] = useState({ player1: 0, player2: 0 });
	const [player1X, setPlayer1X] = useState<PlayerState>({
		width: 80,
		height: 10,
		x: width / 2 - 40,
		y: height - 20,
	});
	const [player2X, setPlayer2X] = useState<PlayerState>({
		width: 80,
		height: 10,
		x: width / 2 - 40,
		y: 10,
	});
	const [ball, setBall] = useState({
		x: width / 2,
		y: height / 2,
		r: 10,
		c: "#fff",
		vx: 0.7,
		vy: 0.7,
	});

	useEffect(() => {
		socket.on("connect", () => {
			socket.emit("ball", "0ki");
		});
		socket.on("addRoom", (room: string) => {});
	}, [socket]);

	const updateBall = () => {
		let { x, y, r, vx, vy } = ball;
		const newX = x + vx;
		const newY = y + vy;
		if (newX - r <= 0 || newX + r >= width)
			// wall collision
			vx = -vx;
		if (newY - r <= 0 || newY + r >= height)
			// wall collision
			vy = -vy;
		if (
			newY + r >= player1X.y &&
			newX >= player1X.x &&
			newX <= player1X.x + player1X.width
		)
			// player1 collision
			vy = -Math.abs(vy);
		if (
			newY - r <= player2X.y + player2X.height &&
			newX >= player2X.x &&
			newX <= player2X.x + player2X.width
		)
			// player2 collision
			vy = Math.abs(vy);
		else if (newY + r >= player1X.y + player1X.height) {
			// player1 score
			setScore((prev) => ({ ...prev, player2: prev.player2 + 1 }));
			vx = -0.7;
			vy = -0.7;
			x = width / 2;
			y = height / 2;
		}
		if (newY - r <= player2X.y) {
			// player2 score
			setScore((prev) => ({ ...prev, player1: prev.player1 + 1 }));
			vx = 0.7;
			vy = 0.7;
			x = width / 2;
			y = height / 2;
		}
		setBall({ ...ball, x: x + vx, y: y + vy, vx, vy });
	};

	const draw = () => {
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
	};

	useEffect(() => {
		draw();
	}, [player1X, player2X, ball]);

	// useEffect(() => {
	// 	window.addEventListener('keydown', (e) => {
	// 		const { key } = e;
	// 		socket.emit('requesteKey', key, height, width, player1X);
	// 		socket.on('responseKeys', (Player) => {
	// 			console.log('responseKeys: ', Player);
	// 			setPlayer1X(Player);
	// 		});
	// 	});

	// 	return () => window.removeEventListener('keydown', () => { });
	// }, [socket]);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const clientX = e.clientX;
		const clientY = e.clientY;
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const x = clientX - rect.left;
		const y = clientY - rect.top;

		// Send mouse coordinates to the backend
		const data = {
			x: x,
			y: y,
			height: height,
			width: width,
			player1X: player1X,
		}
		// console.log("clientX: ", x, "clientY: ", y)
		socket.emit("requesteMouse", data);
		socket.on("responseMouse", (data) => {
			console.log("responseMouse: ", data.x);
			const updatedPlayer1X = data.player1X;
			setPlayer1X(updatedPlayer1X);
		});
	};

	useEffect(() => {
		socket.on("responseKeys", (data) => {
			const newValue = data.newValue;
		});
		return () => {
			socket.off("responseKeys");
		};
	}, []);

	useEffect(() => {
		document.addEventListener("mousemove", handleMouseMove);
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
		};
	});

	return (
		<PlayGround className="">
			<ScoreContainter>
				<div className="score">{score.player1}</div>
				<div className="score">{score.player2}</div>
			</ScoreContainter>
			<canvas ref={canvasRef} width={width} height={height} />
		</PlayGround>
	);
};

export default PingPong;

// useEffect(() => {
// 	window.addEventListener('mousemove', (e) => {
// 		const { clientX, clientY } = e;
// 		const canvas = canvasRef.current;
// 		if (!canvas) return;
// 		const rect = canvas.getBoundingClientRect();
// 		const x = clientX - rect.left;
// 		const y = clientY - rect.top;
// 		if (y > 0 && x > 0 && y < height / 2 && x < width - 80) {
// 			setPlayer2X((prev) => ({ ...prev, x }));
// 		}
// 		if (y > 0 && x > 0 && y > height / 2 && y < height && x < width - 80) {
// 			setPlayer1X((prev) => ({ ...prev, x }));
// 		}
// 	});

// 	return () => window.removeEventListener('mousemove', () => { });
// }, []);

// useEffect(() => {
// 	//	initialize Game Menu
// 	if (canvasRef.current) {
// 		const canvas = canvasRef.current;
// 		ctx = canvas.getContext('2d');
// 		if (ctx) {
// 			ctx.beginPath();
// 			ctx.fillStyle = '#000';
// 			ctx.fillRect(0, 0, width, height);
// 			ctx.fill();
// 			// midline
// 			ctx.setLineDash([10, 10]);
// 			ctx.moveTo(0, height / 2);
// 			ctx.lineTo(width, height / 2);
// 			ctx.strokeStyle = '#fff';
// 			ctx.stroke();
// 			// draw players
// 			drawPlayer(player1X);
// 			drawPlayer(player2X);
// 			// draw ball
// 			drawBall(ball);
// 			const updateBall = () => {
// 				setBall((prev) => {
// 					const { x, y, r, vx, vy } = prev;
// 					const newX = x + vx;
// 					const newY = y + vy;
// 					if (newX < r || newX > width - r) {
// 						return {
// 							...prev,
// 							vx: -vx,
// 						};
// 					}
// 					if (newY < r || newY > height - r) {
// 						return {
// 							...prev,
// 							vy: -vy,
// 						};
// 					}
// 					return {
// 						...prev,
// 						x: newX,
// 						y: newY,
// 					};
// 				});
// 			};
// 			updateBall();
// 		}
// 		window.addEventListener('mousemove', (e) => {
// 			const { clientX, clientY } = e;
// 			const rect = canvas.getBoundingClientRect();
// 			const x = clientX - rect.left;
// 			const y = clientY - rect.top;
// 			if (y > 0 && x > 0 && y < height / 2 && x < width - 80) {
// 				setPlayer2X((prev) => ({ ...prev, x }));
// 			}
// 			if (y > 0 && x > 0 && y > height / 2 && y < height && x < width - 80) {
// 				setPlayer1X((prev) => ({ ...prev, x }));
// 			}
// 		});
// 		return () => {
// 			if (canvasRef.current)
// 				removeEventListener('mousemove', () => { });
// 		};
// 	}
// }, [player1X, player2X, ball]);
