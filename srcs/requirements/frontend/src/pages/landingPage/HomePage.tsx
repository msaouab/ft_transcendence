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
				h1, .quotes, .btn, p, .animation {
					padding: 1rem;
				}
				h1 {
					padding-top: 0;
					font-size: 6rem;
					color: #E9D990;
				}
				.textLandingPage {
					padding-top: 2rem;
					color: #C4C4C4;
					width: 60%;
					text-align: center;
					font-size: 20px;
				}
				.animation {
					border: 1px solid red;
					display: flex;
					justify-content: space-between;
					padding: 1rem 0;
					width: 20%;
					height: 150px;
					.pallete, .ball {
						width: 20px;
						background-color: var(--goldColor);
					}
					.pallete {
						height: 100px;
						width: 15px;
					}
					.p1 {
					}
					.ball {
						border-radius: 50%;
						align-items: center;
						margin: auto;
						height: 20px;
						margin: 1rem 5rem;
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
						<p className='textLandingPage'>Is a table tennis–themed twitch arcade sports video game, 
							featuring simple two-dimensional graphics, 
							manufactured by Atari and originally released in 1972.
						</p>
						<div className='animation'>
							<div className='pallete p1'></div>
							<div className='ball'></div>
							<div className='pallete p2'></div>
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

// .footerLandingPage {
// 	border: 1px solid white;
// 	/* position: absolute; */
// 	display: grid;
// 	align-items: center;
// 	justify-content: center;
// 	/* left: 15%; */
// 	/* bottom: 0; */
// 	p {
// 		color: #C4C4C4;
// 		font-size: 1.2rem;
// 		line-height: 30px;
// 		width: 60rem;
// 	}
// 	.animation {
// 		border: 1px solid red;
// 		display: flex;
// 		align-items: center;
// 		.pallete {
// 			width: 15px;
// 			height: 110px;
// 			background-color: var(--goldColor);
// 		}
// 		.p1 {
// 		}
// 		.p2 {
// 		}
// 		.ball {
// 			width: 20px;
// 			height: 20px;
// 			border-radius: 50%;
// 			background-color: var(--goldColor);
// 			/* justify-content: center; */
// 		}
// 	}
// }