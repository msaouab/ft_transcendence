import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import avatar from '../../../public/default.png'
import cover from '../../../public/cover.jpg'
import WebFont from 'webfontloader';
import {Joystick} from '../../assets/icons'
// import { History} from "history"

const CoverContainer = styled.div`
    background-image: url(${cover});
    background-size: cover;
    background-position: center;
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;

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
    /* .PP{
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 5fr 1fr;
        
    } */
    .PP {

        /* border-radius: 50%;
        /* width: 20rem;
        height: 20rem; 
        border: 1px solid #726969;
        box-sizing: content-box; */
        /* position: relative; */
        border: 1px solid red;
        width: 20rem;
        margin: 2rem;
    .avatar {
        padding: 0rem;
        width: 100%;
        height: auto;
        border-radius: 50%;
        border: 3px solid black;
        box-sizing: border-box;
        /* display: flex; */

    }
    .circle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        /* grid-template-columns: auto; */
        /* justify-self: end;
        justify-content: end; */
        position:absolute;
        top: 19.1rem;
        left: 24rem;
        /* margin-left: 20rem;
        margin-top: -6rem; */
        border: 1px solid aqua;
        z-index: 1;
        /* align-items: center; */
        .circle-outgame {
            display: none;
        }
    }
}
    .Offline {
        background-color: #726969;
    }
    .Idle {
        background-color: yellow;
    }
    .DoNotDisturb {
        background-color: #726969;
    }
    .Online {
        background-color: green;
    }
    .InGame {
        background-color: purple;
    }
    .user-name {
        padding: 2rem;
        h1 {
            font-size: 3rem;
            font-family: 'Fjalla One', sans-serif;
            font-weight: bolder;
        }
    }
	p {
		color: white;
        font-family: 'Fjalla One', sans-serif;
        font-size: 2rem;
	}
    .status {
        padding-top: 2rem;
        text-align: center;
        justify-content: center;
    }
`;

function	Cover() {
    const [loading, setLoading] = useState(true);
    const [OnlineStat, setOnlineStat] = useState('Online');
	const [user, printData] = useState({
        id: '',
		login: '',
		firstName: '',
		lastName: '',
		status: '',
	});
	const navigate = useNavigate();
    useEffect(() => {
        WebFont.load({
          google: {
            families: ['Fjalla One', 'sans-serif']
          }
        });
       }, []);

	useEffect(() => {
		setLoading(true);
        const apiUrl = 'http://localhost:3000/api/v1/me'
		async function fetchData() {
		try {
			await axios.get(apiUrl, {
        	 withCredentials: true,
        	})
			.then(response => {
				if (response.statusText) {
					printData(response.data);
				}
				setLoading(false);
                // setOnlineStat(user.status);
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
		<CoverContainer className='l'>
			{
				loading ? ( <div className='spinner'></div> ) : (
					<>
                        <div className="PP">
                            <img src={avatar} alt="Avatar" className="avatar"/>
                            <div className={`circle ${user.status}`} >
                                <div className={`
                                    ${user.status == 'InGame' ? 'circle-ingame' : 'circle-outgame'}
                                `}>
                                    <Joystick />
                                </div>
                            </div>
                        </div>
                        <div className="user-name">
						    <h1>{user.firstName} {user.lastName}</h1>
                            {/* <b>aka</b> */}
						    <p>{user.login}</p>
                        </div>
						<p>{user.id}</p>
                        <p className="status">{user.status}</p>
					</>
				)
			}
		</CoverContainer>
	)
}

export	default Cover
