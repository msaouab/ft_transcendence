import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Logo from '/logo.svg'
import {Home, Chat , Game, Settings, Profile, Logout} from '../../assets/icons'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const	SideBarContainer = styled.div<{ width?: number; isSidebarOpen: boolean }>`
	background-color: #504A4A;
	width: 80px;
	position: absolute;
	top: 1rem;
	left: 1rem;
	bottom: 1rem;
	padding-top: 1.5rem;
	padding-bottom: 1.5rem;
	border-radius: 5px;
	box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.75);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	${props => props.width && `width: ${props.width}px;`}
	transition: width 0.5s ease-in-out;
`;

const LogoContainer = styled.div<{ isSidebarOpen: boolean }>`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	height: 100px;
	.logo {
		width: 50px;
	}
`;

const SideBarMenu = styled.div<{ width?: number }>`
	margin-top: 2rem;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	${props => props.width && `width: ${props.width}px;`}
	padding: 10px 0;
	border-radius: 3px;
	background-color: #5b5656;
	cursor: pointer;
	&:hover {
		background-color: #494343;
	}
	& > .menu {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 20px;
		transition: transform 0.1s ease-in-out;
		& > span {
			width: 30px;
			height: 3px;
			background-color: white;
			border-radius: 3px;
			transition: transform 0.1s ease-in-out;
		}
	}
	.activeMenu .bar1 {
		transform: rotate(-45deg) translate(-5px, 6px);
	}
	.activeMenu .bar2 {
		opacity: 0;
		transition: all .5s ease-in-out;
	}
	.activeMenu .bar3 {
		transform: rotate(45deg) translate(-6px, -7px);
	}
	& > .hide {
		display: none;
	}
	& > .show {
		display: block;
		color: white;
	}
	@media (max-width: 768px) {
		border: 1px solid white;
		width: 40px;
		margin-top: 0;
		& > .show {
			display: none;
		}
	}
`;

const IconsContainer = styled.div<{ width?: number; isSidebarOpen: boolean }>`
	margin-top: -5rem;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	& > .icon {
		display: flex;
		align-items: center;
		${props => props.width && `width: ${props.width}px;`}
		transition: width .5s ease-in-out;
		height: 60px;
		svg {
			transition: all 1s ease-in-out;
		}
		span {
			color: white;
			display: none;
		}
	}
	& > .hide {
		justify-content: center;
		svg {
			transition: all 1s ease-in-out;
		}
		span {
			transition: all 1s ease-in-out;
			display: none;
		}
	}
	& > .show {
		justify-content: space-evenly;
		svg {
			transition: all 1s ease-in-out;
		}
		span {
			width: 60px;
			transition: all 1s ease-in-out;
			display: block;
		}
	}
	& > .icon:hover {
		background-color: #494343;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.75);
		border-right: 5px solid #F2C94C;
	}
	& > .active {
		border-right: 5px solid #F2C94C;
	}
`;

const LogoutContainer = styled.div<{ width?: number }>`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	& > .icon {
		display: flex;
		align-items: center;
		${props => props.width && `width: ${props.width}px;`}
		transition: width .5s ease-in-out;
		height: 60px;
		svg {
			transition: all 1s ease-in-out;
		}
		span {
			color: white;
			display: none;
		}
	}
	& > .hide {
		justify-content: center;
		svg {
			transition: all 1s ease-in-out;
		}
		span {
			transition: all 1s ease-in-out;
			display: none;
		}
	}
	& > .show {
		justify-content: space-evenly;
		svg {
			transition: all 1s ease-in-out;
		}
		span {
			width: 60px;
			transition: all 1s ease-in-out;
			display: block;
		}
	}
	& > .icon:hover {
		background-color: #494343;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.75);
	}
	@media (max-width: 768px) {
	}
`;

const SideBar = () => {
	const [activeLink, setActiveLink] = useState<string>('home');
	const [activeMenu, setActiveMenu] = useState<boolean>(false);
	const [sidebarWidth, setSidebarWidth] = useState<number>(80);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const location = useLocation();
	// function log

	useEffect(() => {
		const storedLink = localStorage.getItem('activeLink');
		if (storedLink) {
			setActiveLink(storedLink);
    	}
	}, []);
	useEffect(() => {
		localStorage.setItem('activeLink', activeLink);
	}, [activeLink]);
	const handleClick = (link: string) => {
		setActiveLink(link);
		setActiveMenu(false);
		console.log(link);
	}

	const handleMenuClick = () => {
		setActiveMenu(!activeMenu);
		setSidebarWidth(prevWidth => prevWidth === 80 ? 240 : 80);
	};
	const handleToggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};
	const navigate = useNavigate();
	useEffect(() => {
        const apiUrl = 'http://localhost:3000/api/v1/me'
		async function fetchData() {
            try {
                await axios.get(apiUrl, {
        	 withCredentials: true,
        	})
			.then(response => {
				if (response.statusText) {
				}
				Cookies.set('userid', response.data.id);
                // setOnlineStat(user.status);
			})
			.catch(error => {
                if (error.response.status == 401) {
                    navigate('/login');
                }
			})
		} catch (error) {
            console.log(error);
		}
	}  fetchData();
    }, []);
	const handleLogout = () => {
		async function logout() {
			const apiUrl = 'http://localhost:3000/api/v1/logout';
			try {
				await axios.get(apiUrl, { withCredentials: true })
				.catch(error => {
					if (error.response.status == 401) {
				   navigate('/login');
				}
				})
			} catch (error) {
				console.log(error);
			}
		}
		logout();
	};





	return (
		<SideBarContainer width={sidebarWidth} isSidebarOpen={isSidebarOpen}>
			<LogoContainer className='iconContainer' isSidebarOpen={isSidebarOpen}>
				<Link to="/home" className=' iconLogo'><img src={Logo} alt="Logo" className='logo'/></Link>
				<SideBarMenu width={sidebarWidth === 240 ? 180 : 40} onClick={() => {
					handleMenuClick();
					handleToggleSidebar();
				}}>
					<div className={`menu ${activeMenu ? 'activeMenu' : ''}`}>
						<span className={isSidebarOpen ? "bar1 activeMenu" : "bar1"}></span>
						<span className={isSidebarOpen ? "bar2 activeMenu" : "bar2"}></span>
						<span className={isSidebarOpen ? "bar3 activeMenu" : "bar3"}></span>
					</div>
					<p className={`${sidebarWidth >= 200 ? 'show' : 'hide'}`}>Task Manager</p>
				</SideBarMenu>
			</LogoContainer>
			<IconsContainer className='iconContainer' width={sidebarWidth} isSidebarOpen={isSidebarOpen}>
				{/* <div className="menu" onClick={handleToggleSidebar}>
					<span className={isSidebarOpen ? "bar1 activeMenu" : "bar1"}></span>
					<span className={isSidebarOpen ? "bar2 activeMenu" : "bar2"}></span>
					<span className={isSidebarOpen ? "bar3 activeMenu" : "bar3"}></span>
				</div> */}
				<Link to="/home"
					className={`icon ${sidebarWidth >= 200 ? 'show' : 'hide'} ${location.pathname === '/home' ? 'active' : ''}`}
					onClick={() => handleClick('home')}>
					<Home fill='none' /><span>Home</span>
				</Link>
				<Link to="/profile"
					className={`icon ${sidebarWidth >= 200 ? 'show' : 'hide'} ${location.pathname === '/profile' ? 'active' : ''}`}
					onClick={() => handleClick('profile')}>
					<Profile /><span>Profile</span>
				</Link>
				<Link to="/game"
					className={`icon ${sidebarWidth >= 200 ? 'show' : 'hide'} ${location.pathname === '/game' ? 'active' : ''}`}
					onClick={() => handleClick('game')}>
					<Game fill='white'/><span>Game</span>
				</Link>
				<Link to="/chat"
					className={`icon ${sidebarWidth >= 200 ? 'show' : 'hide'} ${location.pathname === '/chat' ? 'active' : ''}`}
					onClick={() => handleClick('chat')}>
					<Chat /><span>Chat</span>
				</Link>
				<Link to="/settings"
					className={`icon ${sidebarWidth >= 200 ? 'show' : 'hide'} ${location.pathname === '/settings' ? 'active' : ''}`}
					onClick={() => handleClick('settings')}>
					<Settings /><span>Setting</span>
				</Link>
			</IconsContainer>
			<LogoutContainer className='iconContainer' width={sidebarWidth}>
				<Link to="/" className={`icon ${sidebarWidth >= 200 ? 'show' : 'hide'}`}
				onClick={() => handleLogout()}
				><Logout/><span>Logout</span></Link>
			</LogoutContainer>
		</SideBarContainer>
	)
};

export default SideBar;
