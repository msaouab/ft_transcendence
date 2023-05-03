import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import avatar from '../../../public/default.png'
import cover from '../../../public/cover.jpg'
import WebFont from 'webfontloader';
import {Joystick} from '../../assets/icons'
import Cookies from 'js-cookie'
// import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ProgressBar from "@ramonak/react-progress-bar";

const CoverContainer = styled.div`
    background-image: url(${cover});
    background-size: cover;
    background-position: center;
    display: grid;
    grid-template-columns: 1fr 5fr 1fr;
    border-radius: 1rem;


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
    .PP {
        width: 20rem;
        margin: 2rem;
    .avatar {
        padding: 0rem;
        width: 100%;
        height: auto;
        border-radius: 50%;
        box-sizing: border-box;


    }
    .circle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        position:absolute;
        top: 23.5rem;
        left: 24rem;
        z-index: 1;
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
        .joystick{
            position: absolute;
            top: 4px;
            left: 5px;

        }
    }
    .user-name {
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
        padding: 2rem;
        h1 {
            font-size: 3rem;
            font-family: 'Fjalla One', sans-serif;
            font-weight: bolder;
        }
        p {
            color: white;
            font-family: 'Fjalla One', sans-serif;
            font-size: 2rem;

        }
    }
    .status {
        padding-top: 2rem;
        padding-bottom: 1rem;
        text-align: center;
        justify-content: center;
    }
    .stats {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
`;

function	Cover() {
    const [loading, setLoading] = useState(true);
	const [user, printData] = useState({
        id: '',
		login: '',
		firstName: '',
		lastName: '',
		status: '',
	});
    const [rankData, getRankData] = useState({
        wins: '',
        loses: '',
        draws: '',
        level: '',
        rank: '',
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
                    Cookies.set('userid', response.data.id);
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
	}  fetchData();
    }, []);
    useEffect(() => {
    const rankUrl = 'http://localhost:3000/api/v1/user/' + Cookies.get('userid') + '/rankData';
    async function fetchRankData() {
        try {
            await axios.get(rankUrl, {
            withCredentials: true,
        })
        .then(response => {
            if (response.statusText) {
                getRankData(response.data);
            }
            setLoading(false);
        })
        .catch(error => {
            setLoading(false);
            if (error.response.status == 401) {
                navigate('/login');
                }
            })
        } 
        catch (error) {
        console.log(error);
        }
    } fetchRankData();
}, []);
// const percentage = rankData.level;

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
                                    <div className="joystick">
                                         <Joystick />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="user-name">
						    <h1>{user.firstName} {user.lastName}</h1>
						    <p>{user.login}</p>
                        <div className='stats'>
                        <p>WINS : {rankData.wins}</p>
                        <p>LOSSES : {rankData.loses}</p>
                        <p>DRAWS : {rankData.draws}</p>
                        {/* <p className="status">MASTER</p> */}
                        </div>
                        <ProgressBar completed={rankData.level} bgColor="black" height="3rem" />
                        </div>
                        {/* <p>MASTER</p> */}
                        {/* <CircularProgressbar value={percentage} text={`${percentage}%`}  /> */}
						{/* <p>{user.id}</p> */}
					</>
				)
			}
		</CoverContainer>
	)
}

export	default Cover
