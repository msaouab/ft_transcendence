import imgSAOUAB from '../assets/ProfileTeam/msaouab.jpeg';
import imgQESSAM from '../assets/ProfileTeam/iqessam.jpeg';
import imgENNASRY from '../assets/ProfileTeam/ren-nasr.jpeg';
import imgBEHHAR from '../assets/ProfileTeam/mbehhar.jpeg';
import imgCHOUKRI from '../assets/ProfileTeam/ichoukri.jpeg';

interface MyObject {
	id: number;
	name: string;
	img: string;
	title: string;
	twitter: string;
	github: string;
	linkedin: string;
}

const myObj: MyObject[] = [
	{
	  id: 1,
	  name: 'Mohamed SAOUAB',
	  img: imgSAOUAB,
	  title: 'DevOps Engineer',
	  twitter: 'https://twitter.com/msaouab',
	  github: 'https://github.com/msaouab',
	  linkedin: 'https://www.linkedin.com/in/msaouab/',
	},
	{
	  id: 2,
	  name: 'Ilyass QESSAM',
	  img: imgQESSAM,
	  title: 'Cloud Engineer',
	  twitter: 'https://www.google.com',
	  github: 'https://github.com/iqessam',
	  linkedin: 'https://www.linkedin.com/in/ilyassqessam/',
	},
	{
		id: 3,
		name: 'Rida En-nasry',
		img: imgENNASRY,
		title: 'FullStack Engineer',
		twitter: 'https://www.google.com',
		github: 'https://github.com/RidaEn-nasry',
		linkedin: 'https://www.linkedin.com/in/rida-ennasry/',
	},
	{
		id: 4,
		name: 'Mohamed Behhar',
		img: imgBEHHAR,
		title: 'FullStack Engineer',
		twitter: 'https://www.google.com',
		github: 'https://github.com/MohamedBehhar',
		linkedin: 'https://www.linkedin.com/in/mohamed-behhar-332025155/',
	},
	{
		id: 5,
		name: 'Ismail Choukri',
		img: imgCHOUKRI,
		title: 'Software Engineer',
		twitter: 'https://www.google.com',
		github: 'https://github.com/ichoukri',
		linkedin: 'https://www.google.com',
	}
];

export default myObj;