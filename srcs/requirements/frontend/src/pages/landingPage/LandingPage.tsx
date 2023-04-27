import styled from 'styled-components'
import backGroundGif from '../../assets/Background.gif';
import RegisterNowBtn from '../../components/RegisterNowBtn';
import Quotes from '../../components/Quotes';
import NavBar from '../../components/NavBar';

const LandingContainer = styled.div`
	.landingPage {
		.mainLandingPage {
			display: flex;
			justify-content: center;
			.textContent {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-top: 10rem;
				width: 50%;
				h1 {
					text-align: center;
					padding-top: 0;
					font-size: 7rem;
					color: #E9D990;
				}
				.textLandingPage {
					padding: 1rem 0;
					margin-top: 4rem;
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
						margin: 2rem auto;
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
			z-index: -1;
			img {
				max-width: 100%;
				box-sizing: border-box;
				width: 100%;
				z-index: -1;
			}
		}
	}
}

@media screen and (max-width: 1500px) {
	.landingPage {
		.mainLandingPage {
			flex-direction: column-reverse;
        	.textContent {
				margin-top: 2rem;
        		width: 100%;
        	}
        	.gifContent {
				width: 100%;
				img {
					max-width: 100%;
					width: 100%;
				}
        	}
    	}
	}
}
@media screen and (max-width: 580px) {
	.landingPage {
		.mainLandingPage {
			flex-direction: column-reverse;
        	.textContent {
				h1 {
					font-size: 4rem;
				}
				.textLandingPage {
					width: 90%;
					text-align: justify;
					h2 {
						padding: 0;
					}
					.animation {
						width: 90%;
					}
				}
        	}
    	}
	}
}
`;

function	LandingPage() {
	return (
		<LandingContainer id='home'>
			<NavBar />
			<div className='landingPage'>
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
		</LandingContainer>
	)
}

export	default LandingPage
