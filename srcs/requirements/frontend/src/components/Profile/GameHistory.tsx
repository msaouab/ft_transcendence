// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import styled from "styled-components";
// import avatar from '../../../public/default.png'
// import WebFont from 'webfontloader';
// import {Joystick} from '../../assets/icons'
import Game from "./Game";

const GameHistoryContainer = styled.div`
    background-color: var(--backgColor);
    display: grid;
    grid-template-rows: 1fr 1fr;
    height: 23rem;
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
    .l{
        Game {
            background-color: gray;
        }
    }
`;

function	GameHistory() {
    // const [loading, setLoading] = useState(false);
	// const [user, printData] = useState({
    //     id: '',
	// 	login: '',
	// 	firstName: '',
	// 	lastName: '',
	// 	status: '',
	// });
	// const navigate = useNavigate();
    // useEffect(() => {
    //     WebFont.load({
    //       google: {
    //         families: ['Fjalla One', 'sans-serif']
    //       }
    //     });
    //    }, []);

	// useEffect(() => {
	// 	setLoading(true);
    //     // const apiUrl = 'http://localhost:3000/api/v1/gameHistory'
	// 	async function fetchData() {
	// 	try {
	// 		await axios.get(apiUrl, {
    //     	 withCredentials: true,
    //     	})
	// 		.then(response => {
	// 			if (response.statusText) {
	// 				printData(response.data);
	// 			}
	// 			setLoading(false);
    //             // setOnlineStat(user.status);
	// 		})
	// 		.catch(error => {
	// 		   setLoading(false);
	// 		   if (error.response.status == 401) {
	// 			   navigate('/login');
	// 			 }
	// 		})
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }
	// fetchData();
	// 	}, []);

	return (
		<GameHistoryContainer className='l'>
            <Game></Game>
            <Game></Game>			
		</GameHistoryContainer>
	)
}

export	default GameHistory
