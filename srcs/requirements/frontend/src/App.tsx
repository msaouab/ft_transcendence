import { Route, Routes } from 'react-router-dom';
import AboutPage from './pages/landingPage/AboutPage';
import LandingPage from './pages/landingPage/LandingPage';
import LoginPage from './pages/loginPage/LoginPage';
import Home from './pages/home/home';
import Profile from './pages/user/Profile';

function App() {
	return (
		<Routes>
			<Route path='/' element={<LandingPage />} />
			<Route path='/about' element={<AboutPage />} />
			<Route path='/login' element={<LoginPage />} />
			<Route path='/home' element={<Home />} />
			<Route path='/profile' element={<Profile />} />
		</Routes>
	);
}

export default App;