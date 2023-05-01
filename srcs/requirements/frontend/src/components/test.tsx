import { ReactElement, SVGProps } from 'react';
import Logo from '/logo.svg'
import Home from '../../assets/icons/icon-home.svg';
import Profile from '../../assets/icons/icon-profile.svg';
import Game from '../../assets/icons/icon-game.svg';
import Chat from '../../assets/icons/icon-chat.svg';
import Setting from '../../assets/icons/icon-setting.svg';
import Logout from '../../assets/icons/icon-logout.svg';

const importedIcons = {
	Logo,
	Home,
	Profile,
	Game,
	Chat,
	Setting,
	Logout
};

type IconName = keyof typeof importedIcons;
type ReactComponent = (props: SVGProps<SVGSVGElement>) => ReactElement;
export default importedIcons as Record<IconName, ReactComponent>;