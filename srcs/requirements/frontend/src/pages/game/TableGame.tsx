import styled from "styled-components"
import SideBar from "../../components/common/SideBar"
import Game from "../../components/common/Game"
const GameTableContainer = styled.div`
	margin-left: 7rem;
	height: 100vh;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
`;

function TableGame () {
	return (
		<GameTableContainer>
			<SideBar />
			<main>
				<Game />
			</main>
		</GameTableContainer>
	)
}

export default TableGame 