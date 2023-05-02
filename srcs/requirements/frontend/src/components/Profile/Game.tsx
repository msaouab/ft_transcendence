// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import styled from "styled-components";
// import WebFont from 'webfontloader';

const GameContainer = styled.div`
    border-radius: 1rem;
    display: grid;
    grid-template-columns: 1fr 4fr;
    height: 50%;
    color: white;
    text-align: center;
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

    .GamsStatus {
        background-color: gray;
        border-top-left-radius: 1rem;
        border-bottom-left-radius: 1rem;
        margin-left: 1rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
        font-size: 6rem;
        font-weight: bold;
        text-align: center;
    }

    .GameData {
        background-color: gray;
        border-top-right-radius: 1rem;
        border-bottom-right-radius: 1rem;
        margin-right: 1rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        font-size: 2rem;
        font-weight: bold;
        text-align: center;
        padding-top: 3rem;
    }

`;

function	Game() {
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
    //     // const apiUrl = 'http://localhost:3000/api/v1/Game'
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
		<GameContainer className='Gamectnr'>
				
                       
                <div className="GamsStatus">
                    <h1>W</h1>
                </div>
                <div className="GameData">
                <p>PLAYER1</p>
                <p>5</p>
                <p>-</p>
                <p>0</p>
                <p>PLAYER2</p>
                </div>

                        
					

		</GameContainer>
	)
}

export	default Game
