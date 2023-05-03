// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import styled from "styled-components";
// import WebFont from 'webfontloader';
import avatar from '../../../public/default.png'

const AchievementsContainer = styled.div`
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
		height: 10rem;
	}
	
	`;

const Achivements = [
	{
	  title: "First Game",
	  description: "You played your first game",
	},
	{
		title: "Comeback Kid",
		description: "You won a game after being down 5-0",
	},
	{
		title: "Winning Streak",
		description: "You won 5 games in a row",
	},
	{
		title: "Winning Streak",
		description: "You won 5 games in a row",
	},
	
];

const AchivementCard = styled.div`
	background: gray;
	margin: .5rem;
	border-radius: 1rem;
	overflow: hidden;
	padding: 0;
	.logo {
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
		grid-template-columns: 1fr 7fr;
		/* display: flex;
		flex-direction: column;
		justify-content: space-between; */
	}
	
	.title {
		font-family: 'tahoma';
		margin-top: 0rem;
		margin-bottom: 0rem;
		text-align: left;
		font-size: 2rem;
		font-weight: bold;
	}
	.description {
		margin-left: 1rem;
		text-align: left;
		font-size: 1.3rem;
		font-weight: bold;
		
	}
`;	

function	Achievements() {
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
    //     // const apiUrl = 'http://localhost:3000/api/v1/Achievements'
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
		<AchievementsContainer className='Achievementsctnr'>
			<div className="one">
			{Achivements.map((achivement, index) => (
			<AchivementCard  key={index}>
				<div className="achv">
            		<div className="logo">
						<img src={avatar} alt="Avatar" className="avatar"/>
					</div>
					<div className="data">
            			<div className="title">{achivement.title}</div>
            			<div className="description">{achivement.description}</div>
					</div>
				</div>
          </AchivementCard>
			))
		}
		</div>
		</AchievementsContainer>
	)
}

export	default Achievements
