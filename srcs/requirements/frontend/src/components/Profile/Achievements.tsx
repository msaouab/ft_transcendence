// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import styled from "styled-components";
// import WebFont from 'webfontloader';
import avatar from '../../../public/default.png'

const Achivements = [
	{
	  title: "First Game",
	  description: "You played your first game",
	},
	{
		title: "First Game",
		description: "You played your first game",
	  },
	  {
		title: "First Game",
		description: "You played your first game",
	  },
];

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
		<div className='  flex flex-col gap-2 w-full h-97 bg-bggray rounded-xl overflow-y-scroll  p-2'>
			{/* <div className="one  gap-y-16 bg-mygray  rounded-2xl m-2 "> */}
			{Achivements.map((achivement, index) => (
			<div  key={index} className="bg-mygray  rounded-2xl ">
				<div className=" flex  w-full gap-10" >
            		<div className="logo ">
						<img src={avatar} alt="Avatar" className="avatar max-w-[60px] rounded-[50%] m-2"/>
					</div>
					<div className="data flex  flex-col justify-around">
            			<div className="text-white text-4xl font-bold font-[tahoma]">{achivement.title}</div>
            			<div className="text-white text-xl">{achivement.description}</div>
					</div>
				</div>
          </div>
			))
		}
		{/* </div> */}
		</div>
	)
}

export	default Achievements
