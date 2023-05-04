import styled from "styled-components";

const HeaderContainer = styled.div``;

const HeaderGame = () => {
	return (
		<HeaderContainer>
			<section className="player player1">
				<img src="" alt="" />
				<span className="nickname nick1"></span>
			</section>
			<section className="player player2">
				<img src="" alt="" />
				<span className="nickname nick2"></span>
			</section>
		</HeaderContainer>
	)
};

export default HeaderGame;