import { Home, Chat, Game, Settings, Profile } from '../assets/icons/';

export const IconSideBar = [
	{
		id: 0,
        path: '/',
        icon: <Home />,
        fill: 'none',
    },
    {
        id: 1,
        path: '/tasks',
        icon: <Profile />
    },
    {
        id: 2,
        path: '/chats',
        icon: <Game />
    },
    {
		id: 3,
        path: '/team',
        icon: <Chat />
    },
    {
		id: 4,
        path: '/analytics',
        icon: <Settings />
    }
];