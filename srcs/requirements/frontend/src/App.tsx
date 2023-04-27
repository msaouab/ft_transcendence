import { Route, Routes } from 'react-router-dom';
import AboutPage from './pages/landingPage/AboutPage';
// import ContactPage from './pages/landingPage/ContactPage';
import LandingPage from './pages/landingPage/LandingPage';

function App() {
	return (
		<Routes>
			<Route path='/' element={<LandingPage />} />
			<Route path='/about' element={<AboutPage />} />
		</Routes>
	);
}

export default App;