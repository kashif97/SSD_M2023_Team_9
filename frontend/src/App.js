import SpotDifference from './components/spot-diff'
import Dummy from './components/dummy'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/spotdiff' element={<SpotDifference/>}/> 
        <Route path='/' element={<Dummy/>}/>
      </Routes>
    </Router>
      
  );
}

export default App;
