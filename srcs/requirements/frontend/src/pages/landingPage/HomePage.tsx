import styled from 'styled-components'
import backGroundGif from '../../assets/Background.gif';
import RegisterNowBtn from '../../components/RegisterNowBtn';
import Quotes from '../../components/Quotes';

const	HomePageContainer = styled.div`
	width: 100%;
	position: absolute;
	top: 0;
	z-index: 0;
	.homePage {
		.mainLandingPage {
			display: flex;
			.textContent {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 50%;
				h1, .quotes, .btn, p {
					padding: 1rem;
				}
				h1 {
					padding-top: 0;
					font-size: 6rem;
					color: #E9D990;
				}
				.textLandingPage {
					padding: 1rem 0;
					width: 60%;
					text-align: center;
					color: #C4C4C4;
					h2 {
						font-size: 40px;
						text-align: start;
						padding-left: 1rem;
					}
					p {
						padding: 0 0 2rem 0;
						font-size: 20px;
					}
					.animation {
						position: relative;
						margin: auto;
						width: 50%;
						height: 200px;
						.pallete, .ball {
							background-color: var(--goldColor);
							position: absolute;
						}
						.pallete {
							width: 15px;
							height: 66%;
						}
						.p1 {
							top: 0;
							left: 0;
						}
						.p2 {
							bottom: 0;
							right: 0;
						}
						.ball {
							width: 20px;
							height: 20px;
							border-radius: 50%;
							left: 28%;
							bottom: 50%;
						}
					}
				}
			}
			.gifContent {
				width: 50%;
				display: flex;
				justify-content: flex-end;
				img {
					max-width: 100%;
					box-sizing: border-box;
					width: 100%;
				}
			}
		}
	}
`;

function	HomePage() {
	return (
		<HomePageContainer id='home'>
			<div className='homePage'>
				<div className='mainLandingPage'>
					<div className='textContent'>
						<h1>PING PONG</h1>
						<div className='quotes'><Quotes></Quotes></div>
						<div className='btn'><RegisterNowBtn></RegisterNowBtn></div>
						<div className='textLandingPage'>
							<h2>Pong</h2>
							<p>Is a table tennis–themed twitch arcade sports video game, 
								featuring simple two-dimensional graphics, 
								manufactured by Atari and originally released in 1972.
							</p>
							<div className='animation'>
								<div className='pallete p1'></div>
								<div className='ball'></div>
								<div className='pallete p2'></div>
							</div>
						</div>
					</div>
					<div className='gifContent'>
						<img src={backGroundGif} alt="PingPong.gif"/>
					</div>
				</div>
			</div>
		</HomePageContainer>
	)
}

export	default HomePage
