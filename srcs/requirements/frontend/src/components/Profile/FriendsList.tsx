// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import styled from "styled-components";
// import WebFont from 'webfontloader';

const FriendsListContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 4fr;
	background-color: var(--backgColor);
	border-radius: 1rem;
    height: 31rem;
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
        font-size: 6rem;
        font-weight: bold;
        text-align: center;
    }

    .FriendsListData {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        font-size: 2rem;
        font-weight: bold;
        text-align: center;
        margin-top: 3rem;
    }

`;



function	FriendsList() {
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
    //     // const apiUrl = 'http://localhost:3000/api/v1/FriendsList'
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
		<FriendsListContainer className='FriendsListctnr'>
    
		</FriendsListContainer>
	)
}

export	default FriendsList
