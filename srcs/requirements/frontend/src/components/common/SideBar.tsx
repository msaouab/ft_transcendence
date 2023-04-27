import { Link } from "react-router-dom";
import logo from '/logo.svg'
import home from '../../assets/icons/icon-home.svg';
import profile from '../../assets/icons/icon-profile.svg';
import game from '../../assets/icons/icon-game.svg';
import chat from '../../assets/icons/icon-chat.svg';
import setting from '../../assets/icons/icon-setting.svg';
import logout from '../../assets/icons/icon-logout.svg';
import styled from "styled-components";

const SideBarContainer = styled.div`
	position: absolute;
	top: 1rem;
	bottom: 1rem;
	background: rgba(80, 74, 74, 0.41);
	box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.25);
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	margin: auto 1rem;
	padding: 2rem 0;
	width: 100px;
	.icons {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		.icon {
			border: 1px solid green;
			padding: 1.5rem;
			img {
				border: 1px solid;
				max-width: 100%;
				box-sizing: border-box;
			}
		}
		.icon img {
			padding: .3rem;
			fill: red; /* Change the fill color */
			width: 50px; /* Change the width */
			height: 50px; /* Change the height */
			svg {
				fill: red;
			}
		}
	}
`;

const Logo = styled.div`
	background-image: url(${logo});
	background-repeat: no-repeat;
	background-size: contain;
	width: 50px;
	height: 50px;
`;

function SideBar() {
	return (
		<SideBarContainer>
			<div className="logo">
				<Link to="/" className="icon icon-0"><Logo/></Link>
			</div>
			<div className="icons">
				<Link to="/home" className="icon icon-1"><img src={home} alt="" /></Link>
				<Link to="/profile" className="icon icon-2"><img src={profile} alt="" /></Link>
				<Link to="/game" className="icon icon-3"><img src={game} alt="" /></Link>
				<Link to="/chat" className="icon icon-4"><img src={chat} alt="" /></Link>
				<Link to="/setting" className="icon icon-5"><img src={setting} alt="" /></Link>
			</div>
			<div>
				<Link to="/" className="icon icon-6"><img src={logout} alt="" /></Link>
			</div>
		</SideBarContainer>
	);
};

export default SideBar;
{/* <img src={logo} alt="Logo" className='logo'/> */}