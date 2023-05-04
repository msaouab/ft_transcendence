// import { useState, useRef } from 'react'
import PingPong from './Canvas';
import styled from 'styled-components';

const CanvasContainer = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	border: 1px solid red;
`;

const Game = () => {
	return (
		<CanvasContainer>
			<PingPong width={1160} height={700} />
		</CanvasContainer>
	)
}

export default Game