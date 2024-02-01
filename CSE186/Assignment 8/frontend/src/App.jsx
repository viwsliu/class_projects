import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserProvider } from './UserContext'; 
import Home from './Home';
import LoginScreen from './Loginscreen';

// All Citations for this assignment here:
// https://medium.com/@babux1/how-to-pass-state-data-from-one-component-to-another-in-react-js-9b4850887163#:~:text=One%20of%20the%20main%20methods,child%20component%20as%20an%20attribute.
// https://www.freecodecamp.org/news/how-to-use-proptypes-in-react/#:~:text=import%20PropTypes%20from%20'prop%2Dtypes,%2F%3E%20)%20%7D%3B%20Count.
// https://testing-library.com/docs/react-testing-library/intro/
// TA Jose
// TA Zehui
// chatgpt for how to use props required at bottom of components

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function App() {
  return (
    <UserProvider>
      <div>
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginScreen />} />
              <Route path="/home" exact element={<Home />} />
            </Routes>
        </BrowserRouter>
      </div>
    </UserProvider>
  );
}

export default App;
