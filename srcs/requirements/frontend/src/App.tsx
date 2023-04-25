import { BrowserRouter } from 'react-router-dom';
import styled from 'styled-components'
import LandingPage from './pages/landingPage/LandingPage';

const AppContainer = styled.div`
`;

function App() {

  return (
    // <BrowserRouter>
      <AppContainer>
        <div className="App">
          <LandingPage />
        </div>
      </AppContainer>
    // </BrowserRouter>
  );
}

export default App;
