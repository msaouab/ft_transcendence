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

	return (
		<div className='  flex flex-col gap-2 w-full h-97 bg-bggray rounded-xl overflow-y-scroll  p-2'>
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
		</div>
	)
}

export	default Achievements
