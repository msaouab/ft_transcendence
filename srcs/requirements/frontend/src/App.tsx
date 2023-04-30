import { Route, Routes } from 'react-router-dom';
import AboutPage from './pages/landingPage/AboutPage';
import LandingPage from './pages/landingPage/LandingPage';
// import SideBar from './components/common/SideBar';
import styled from 'styled-components';
import TableGame from './pages/game/TableGame';

const AppContainer = styled.div`
`;

function App() {
	return (
		<AppContainer>

			<Routes>
				<Route path='/' element={<LandingPage />} />
				<Route path='/about' element={<AboutPage />} />
				<Route path='/game' element={<TableGame />} />
			</Routes>
		</AppContainer>
	);
}

export default App;