import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormPage from './pages/FormPage.jsx';
import ResponsePage from './pages/ResponsePage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/response" element={<ResponsePage />} />
      </Routes>
    </Router>
  );
}

export default App;
