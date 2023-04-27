import styled from 'styled-components';
import RegisterNowBtn from '../../components/RegisterNowBtn'
import TeamProfile from '../../components/common/TeamProfile';
import NavBar from '../../components/NavBar';

const	AboutPageContainer = styled.div`
	.aboutPage {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;
		color: #C4C4C4;
		padding: 3rem;
		h1 {
			font-size: 4.1rem;
			margin-top: 3rem;
	}
	p {
		font-size: 1rem;
		margin: 1rem 0;
		width: 30%;
		text-align: center;
	}
	@media (max-width: 1200px) {
		p {
			font-size: 1rem;
			margin: 1rem 0;
			width: 70%;
			text-align: center;
			width: 80%;
		}
	}
	@media (max-width: 768px) {
		align-items: center;
		justify-content: center;
		
		p {
			font-size: 1rem;
			margin: 1rem 0;
			width: 110%;
			text-align: center;
		}
	}
	.team {
		font-size: 2.5rem;
	}
	.registerbtn {
		margin-top: 2rem;
	}
}
`;

function	AboutPage() {
	return (
		<AboutPageContainer id='about'>
			<NavBar />
			<div className='aboutPage'>
				<h1>About</h1>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mattis id urna a vel consequat, diam, gravida pharetra. Neque tempus, vel odio feugiat pretium nunc odio aliquet.</p>
				<h3 className='team'>The Team</h3>
				<TeamProfile />
				<h4>Bring Back Old Memories With Old Friends</h4>
				<div className='registerbtn'>
					<RegisterNowBtn></RegisterNowBtn>
				</div>
			</div>
		</AboutPageContainer>
	);
}

export default AboutPage