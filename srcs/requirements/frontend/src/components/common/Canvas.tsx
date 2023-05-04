import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Socket, io } from 'socket.io-client';

interface PingPongProps {
	width: number;
	height: number;
}

const PlayGround = styled.div`
	border: 1px solid green;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const ScoreContainter = styled.div`
	border: 1px solid blue;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 50%;
	.score {
		font-size: 6rem;
		font-weight: bolder;
		color: white;
	}
`;

const PingPong = ({ width, height }: PingPongProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [player1Y, setPlayer1Y] = useState<number>(height / 2);
	const [player2Y, setPlayer2Y] = useState<number>(height / 2);
	const [mysocket, setSocket] = useState<Socket>();

	useEffect(() => {
		const socket = io('http://localhost:3000/game');
		setSocket(socket);
		socket.on('connect', () => {
			console.log(socket);
			console.log('connected to server');
		});
		socket.on('disconnected', () => {
			console.log('disconnected from server');
		});
		socket.on('paddleUpdate', ({ player1Y, y }) => {
			setPlayer1Y(y);
		});
		return () => {
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			const context = canvas.getContext('2d');
			if (context) {
				context.beginPath();
				context.fillStyle = '#000';
				context.fillRect(0, 0, width, height);
				context.fill();

				const paddleWidth = 10;
				const paddleHeight = 80;

				context.fillStyle = '#fff';
				context.fillRect(
					20,
					player1Y - paddleHeight / 2,
					paddleWidth,
					paddleHeight
				);

				context.fillStyle = '#fff';
				context.fillRect(
					width - paddleWidth - 20,
					player2Y - (paddleHeight / 2),
					paddleWidth,
					paddleHeight
				);

				context.fillStyle = '#fff';
				context.setLineDash([10, 10]);
				context.strokeStyle = '#fff';
				context.moveTo(width / 2, 0);
				context.lineTo(width / 2, height);
				context.stroke();

				const ball = {
					x: width / 2,
					y: height / 2,
					r: 10,
					c: '#fff'
				};
				context.fillStyle = ball.c;
				context.beginPath();
				context.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, true);
				context.closePath();
				context.fill();
			}
		}
	}, [player1Y, player2Y, width, height]);

	useEffect(() => {
		const handlekeyDown = (e: KeyboardEvent) => {
			const movement = { playerId: 1, y: player1Y };

			if (e.key === 'ArrowUp' && player1Y > 47) {
				movement.y -= 10;
			} else if (e.key === 'ArrowDown' && player1Y < height - 47) {
				movement.y += 10;
			}
			mysocket.emit('move', movement);
		};
		window.addEventListener('keydown', handlekeyDown);
		return () => {
			window.removeEventListener('keydown', handlekeyDown);
		};
	}, [player1Y, mysocket]);


	return (
		<PlayGround>
			<ScoreContainter>
				<div className='score'>0</div>
				<div className='score'>0</div>
			</ScoreContainter>
			<canvas ref={canvasRef} width={width} height={height} />
		</PlayGround>
	)
}

export default PingPong;
