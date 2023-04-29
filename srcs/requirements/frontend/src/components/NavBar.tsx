import logo from '/logo.svg'
import styled from 'styled-components'
import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const NavbarContainer = styled.nav`
	nav {
		z-index: auto;
		width: 100%;
		position: absolute;
		background-color: none;
		color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.navbar-brand {
			height: 75px;
			margin-left: 2rem;
			img {
				box-sizing: border-box;
				max-width: 100%;
				width: 100%;
			}
		}
		#navbarMenu {
			.navbar-end {
				.navbar-item {
					color: white;
					padding: 1rem 2rem;
					margin-right: 2rem;
					border: 1px solid transparent;
				}
				.play-now-item {
					background-color: var(--goldColor);
					color: var(--backColor);
					position: relative;
					.play-now {
						font-weight: bolder;
						letter-spacing: 3px;
					}
				}
				.active {
					border: 1px solid var(--goldColor);
					border-radius: 10px;
				}
				.play-now-item:hover {
					border: 1px solid var(--goldColor);
					border-radius: 7px ;
					box-shadow: 10px 10px var(--goldColor);
					color: white;
					background-color: transparent;
					transition: all 0.5s ease-in-out;
				}
			}
		}
	}
	@media screen and (max-width: 768px) {
		nav {
			.navbar-brand {
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 75px;
				margin: 0 2rem;
				img {
					box-sizing: border-box;
					max-width: 100%;
					width: 100%;
				}
				.burger {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: end;
					padding: .2rem;
					gap: 5px;
					span {
						padding: 0;
						margin: 0;
						width: 40px;
						height: 5px;
						border-radius: 5px;
						background-color: var(--goldColor);
					}
					span:nth-child(1) {
						transition: transform 0.5s ease-in-out;
					}
					span:nth-child(2) {
						opacity: 1;
						transition: opacity 1.3s ease-in-out;
					}
					span:nth-child(3) {
						transition: transform 0.5s ease-in-out;
					}
					&.is-active {
						display: flex;
						flex-direction: column;
						justify-content: center;
						span:nth-child(1) {
							width: 40px;
							position: absolute;
							top: 2.47rem;
							transition: transform 0.5s ease-in-out;
							transform: rotate(45deg);
						}
						span:nth-child(2) {
							opacity: 0;
							transition: opacity 0.7s ease-in-out;
						}
						span:nth-child(3) {
							width: 40px;
							transition: transform 0.5s ease-in-out;
							transform: rotate(133deg);
						}
					}
				}
			}
			#navbarMenu {
				display: none;
				position: absolute;
				top: 63px;
				right: 10px;
				background-color: #555D50;
				z-index: 2;
				&.is-active {
					display: block;
				}
				.navbar-end {
					display: flex;
					flex-direction: column;
					width: auto;
					.navbar-item {
						padding: .5rem 1rem;
						margin: 0;
					}
					.active {
						border: none;
						border-radius: 0;
						border-top: 3px solid var(--goldColor);
					}
					.navbar-item:hover {
						background-color: var(--backColor);
						border: none;
					}
				}
			}
		}
	}
`;

const NavBar = () => {
	const location = useLocation();
	const [activeLink, setActiveLink] = useState<string>('home');
	const [showMenu, setShowMenu] = useState<boolean>(false);
	
	useEffect(() => {
		const storedLink = localStorage.getItem('activeLink');
		if (storedLink) {
			setActiveLink(storedLink);
    	}
	}, []);

	useEffect(() => {
		localStorage.setItem('activeLink', activeLink);
	}, [activeLink]);
	const handleLinkClick = (link: string) => {
		setActiveLink(link);
		setShowMenu(false);
	};
	return (
		<NavbarContainer>
			<nav className="navbar">
    			<div className="navbar-brand">
    				<NavLink
        				to="/"
        				className={activeLink === 'Home' ? 'active' : ''}
        				onClick={() => handleLinkClick('Home')}
    				>
        				<img src={logo} alt="Logo" className='logo'/>
    				</NavLink>
        			<button
    					className={`navbar-burger burger ${showMenu ? 'is-active' : ''}`}
    					aria-label="menu"
    					aria-expanded="false"
    					data-target="navbarMenu"
    					onClick={() => setShowMenu(!showMenu)}
        			>
        				<span aria-hidden="true"></span>
        				<span aria-hidden="true"></span>
        				<span aria-hidden="true"></span>
        			</button>
      			</div>
    			<div id="navbarMenu" className={`navbar-menu ${showMenu ? 'is-active' : ''}`}>
        			<div className="navbar-end">
        				<NavLink to="/" className={`navbar-item ${location.pathname === '/' ? 'active' : ''}`}
        					onClick={() => handleLinkClick('Landing')}>Home</NavLink>
        			  	<NavLink to="/about" className={`navbar-item ${location.pathname === '/about' ? 'active' : '' }`}
        			    	onClick={() => handleLinkClick('About')}>About</NavLink>
        				<NavLink to="/home" className={`navbar-item play-now-item`}
        			    	onClick={() => handleLinkClick('Home')}>
								<button className='play-now'>Play Now</button>
						</NavLink>
        			</div>
				</div>
			</nav>
		</NavbarContainer>
	);
}

export	default NavBar
