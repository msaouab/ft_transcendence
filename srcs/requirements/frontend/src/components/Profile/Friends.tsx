import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
// import WebFont from 'webfontloader';
import avatar from '../../../public/default.png'
import Cookies from 'js-cookie'

const FriendsContainer = styled.div`
   display: grid;
    grid-template-rows: 1fr 1fr 1fr;
	background-color: var(--backgColor);
    height: 25rem;
	border-radius: 1rem;
    color: white;
    text-align: center;
	gap: 1rem;
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
	
	.one {
		overflow-y: scroll; 
	 	min-height: 25rem;
	}
	
	`;


const FriendCard = styled.div`
	background: #808080;
	margin: .5rem;
	border-radius: 1rem;
	overflow: hidden;
	padding: 0;
	.logo {
		/* margin-left: 20px; */
	}
	.avatar {
		margin: .5rem;
		margin-left: .5rem;
        border-radius: 50%;
        box-sizing: border-box;
		width: 4rem;

		
    }
	.achv {
		display: grid;
		grid-template-columns: 1fr 8fr;
	}
	
	.login {
		font-family: 'tahoma';
        margin-left: 1rem;
		margin-top: 0rem;
		margin-bottom: 0rem;
		text-align: left;
		font-size: 2rem;
		font-weight: bold;
	}
	.Status {
		margin-left: 1rem;
		text-align: left;
		font-size: 1.3rem;
		font-weight: bold;
		
	}
`;


function	Friends() {
    


	interface friendsInterface {
		login: string;
		Status: string;
	}
	const [loading, setLoading] = useState(true);
	
	const navigate = useNavigate();
	
	const [user, printData] = useState({
		friendUser_id: '',
	});
	
	
	const [friends, setFriends] = useState<friendsInterface[]>([]);
	useEffect(() => {
		setLoading(true);
		const apiUrl = 'http://localhost:3000/api/v1/User/' + Cookies.get('userid') + '/friends';
		async function fetchData() {
			try {
				await axios.get(apiUrl, {
					withCredentials: true,
				})
				.then(response => {
					for (let i = 0; i < response.data.length; i++) {
						axios.get('http://localhost:3000/api/v1/User/' + response.data[i].friendUser_id, {
							withCredentials: true,
						})
						.then(responses => {
							setFriends(friends => [...friends, {
								login: responses.data.login,
								Status: responses.data.status
							}]);
						})
					}
					setLoading(false);
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
		<FriendsContainer className='Friendsctnr'>
			<div className="one">
			{friends.map((Friend, index) => (
			<FriendCard  key={index}>
				<div className="achv">
            		<div className="logo">
						<img src={avatar} alt="Avatar" className="avatar"/>
					</div>
					<div className="data">
            			<div className="login">{Friend.login}</div>
            			<div className="Status">{Friend.Status}</div>
					</div>
					
				</div>
          </FriendCard>
			))
		}
		</div>
		</FriendsContainer>
	)
}

export	default Friends
