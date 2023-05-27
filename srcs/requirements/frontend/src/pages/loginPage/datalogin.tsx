import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Cookies from 'js-cookie';
import { HOSTNAME } from "../../api/axios";
// import { History} from "history"

const LdataContainer = styled.div`
    .spinner {
  		width: 50px;
  		height: 50px;
  		border-radius: 50%;
  		border: 5px solid rgba(0, 0, 0, 0.1);
  		border-top-color: var(--goldColor);
  		animation: spin 1s ease-in-out infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	p {
		color: white;
	}
`;

function	Ldata() {
	const [loading, setLoading] = useState(true);
	const [user, printData] = useState({
		id: '',
		login: '',
		firstName: '',
		lastName: '',
		status: '',
	});
	const navigate = useNavigate();
    
	useEffect(() => {
		setLoading(true);
        const apiUrl = `http://${HOSTNAME}:3000/api/v1/me`
		async function fetchData() {
		try {
			await axios.get(apiUrl, {
        	 withCredentials: true,
        	})
			.then(response => {
				if (response.statusText) {
					printData(response.data);
					Cookies.set('userid', response.data.id);
				}
				setLoading(false);;
			})
			.catch(error => {
			   setLoading(false);
			   if (error.response.status == 401) {
				   navigate('/login');
				 }
			})
		} catch (error) {
			console.log(error);
		}
	}
	fetchData();
		}, []);

	return (
		<LdataContainer className='l'>
			{
				loading ? ( <div className='spinner'></div> ) : (
					<>
						<p>{user.id}</p>
						<p>{user.login}</p>
						<p>{user.firstName}</p>
						<p>{user.lastName}</p>
						<p>{user.status}</p>
					</>
				)
			}
		</LdataContainer>
	)
}

export	default Ldata


// import styled from 'styled-components'
// import logoBlack from '/logoBlack.svg'
// import ftlogo from '/ftlogoWhite.svg'
// import lpPicture from '/login.jpg'
// import { Link } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// // import { Link } from 'react-router-dom';
// const LdataContainer = styled.div`

// 		.loginPage {
// 		width: 100%;
// 		height: 100vh;
// 		display: grid;
// 		grid-template-columns: [first content-start] 1fr [content-end sidebar-start] 700px [lastline];
// 		.loginPagePicture{
// 			margin: auto 0;
// 			width: 100%;
// 			/* padding-top: 7rem; */
// 			img {
// 				max-width: 100%;
// 				width: 100%;
// 				box-sizing: border-box;

// 			}
// 		}
// 		.whiteBoard {
// 			height: 100%;
// 			background-color: white;
// 			display: grid;
// 			/* grid-template-columns: repeat(3, 1fr); */
// 			/* grid-column-gap: 10rem; */
// 			/* grid-template-rows: [first content-start] 1fr [content-end sidebar-start] 700px [lastline]; */
// 			.logo {
// 				display: block;
//       			margin: 20rem auto;
// 				width: 30%;
// 				margin-bottom: 1rem;
// 				grid-template-rows: 4fr 1fr 1fr 1fr;
// 			}
// 			.ftbutton {
// 				color: white;
// 				background-color: black;
// 				box-shadow:  3px 3px #c2bfbf;
// 				display: flex;
// 				justify-content: space-evenly;
// 				border-radius: 25px;
// 				margin: 0 6rem;
// 				white-space: nowrap;
// 				overflow-x: auto;
// 				height: 3.5rem;
// 				padding: 1rem 0;
// 				div {
// 					display: inline-block;
// 					vertical-align: middle;
// 					/* margin-left: -10rem; */
//     				height: auto;
//     				position: relative;
// 				}
// 				img {
// 					display: inline-block;
//   					vertical-align: middle;

// 				}
// 			}
// 			.prvs {
// 				text-align: center;
// 				color: #cbc6c6;
// 				margin: -10rem;
// 			}
			
// 				.prvs a {
// 					text-decoration: none;
// 					display: inline-block;
// 					padding: 8px 16px;
// 				}
// 				.prvs a:hover {
// 					background-color: #6c6a6a;
// 					color: black;
// 				}
// 				.previous {
// 					  background-color: #cbc6c6;
// 					  color: black;
// 				}

// 			}
// 		.terms {
// 			margin-top: -15rem;
// 			text-align: center;
// 			a {
// 				text-decoration: underline;
// 				color: #25BB00
// 			}
// 			p {
// 				padding: 2rem;
// 			}
// 			.rectangle {
//   			height: 7px;
//   			background-color: #a5a5a5;
// 			margin: 0 3rem;
// 			border-radius: 15rem;
// 			}
// 		}
// 	}
// 	@media screen and (max-width:1426px) {
// 		.loginPage {
// 			display: flex;
// 			.whiteBoard {
// 				.logo {
// 					width: 50%;
// 				}
// 				.ftbutton {
// 					margin: 0 3rem;

// 			}
// 		}

// 	}
// }
// /*  */
// 	@media screen and (max-width: 768px) {
// 		.loginPage {
// 			display: block;
// 			overflow: hidden;
// 			.loginPagePicture {
// 				display: none;
// 			}
// 			background-image: url('/loginZoomed.jpg');
// 			background-repeat: no-repeat;
// 			background-size: cover;
// 			background-position: center;
// 			background-attachment: fixed;
// 			.whiteBoard {
// 				height: 90%;
// 				width: 80%;
// 				margin: 3rem auto;;
// 				background-color: rgba(255, 255, 255, 0.471);
// 				display: grid;
// 				.logo {
// 					filter: blur(0px);
// 					margin: 3rem auto;
// 					margin-bottom: 15rem;
// 				}
// 				.ftbutton {
// 					margin-top: -2rem;
// 					margin-bottom: 5rem;
// 				}
// 				.prvs {
// 					margin-top: -5rem;
// 					margin-bottom: 7rem;
// 				}
// 				.terms {
// 					padding-top: 30rem;
// 				}
// 				font-weight: bolder;
// 			}
// 		}
		
// 	}

// `;



// function	LoginPage() {
// 		useEffect(() => {
// 			const storedLink = localStorage.getItem('activeLink');
// 			if (storedLink) {
// 				setActiveLink(storedLink);
// 			}
// 		}, []);
	
// 		useEffect(() => {
// 			localStorage.setItem('activeLink', activeLink);
// 		}, [activeLink]);
	
// 	const handleLinkClick = (link: string) => {
// 		setActiveLink(link);
// 	};
// 	return (
// 		<LdataContainer className='lp'>
// 		<div className='loginPage'>
// 			<div className='loginPagePicture'>
// 				<img src={lpPicture} alt="Logo" className='lpPicture'/>
// 			</div>
// 			<div className='whiteBoard'>
// 				<img src={logoBlack} alt="Logo" className='logo'/>
// 				<Link to="localho3t:4000/api/v1/login/42" className={`ftauth`}>
// 					<a href="locfalhost:3000/api/v1/login/42" target="_blank" rel="noreferrer">
// 					<div className='ftbutton'>

// 							<img src={ftlogo} alt="42logo" className='ftlogo' />
// 							<div>
// 								<button className='play-now'>Continue With 42</button>
// 							</div>
// 					</div>
// 					</a>
// 				</Link>
// 				<div className='prvs'>
// 					<Link to="/" className="previous">&laquo; </Link>
// 					<p>Go Back</p>
// 				</div>
// 				<div className='terms'>
// 					<p>By continuing, you agree to our <a href="https://www.42.fr/en/privacy-policy/" target="_blank" rel="noreferrer">
// 						Terms of Service</a> and <a href="https://www.42.fr/en/privacy-policy/" target="_blank" rel="noreferrer">
// 						Privacy Policy</a></p>
// 						<div className="rectangle"></div>
// 						<p>NOT ON PONG YET?</p>
// 						<Link to="locaflhost:3000/api/v1/login/42" className={`ftauth`}
//         				onClick={() => handleLinkClick('locaflhost:3000/api/v1/login/42')}>
// 							SIGN UP NOW!
// 					</Link>
// 				</div>
// 			</div>

// 		</div>
		
// 		</LdataContainer>
// 	)
// }

// export	default LoginPage
