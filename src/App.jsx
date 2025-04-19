import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormPage from './pages/FormPage.jsx';
import ResponsePage from './pages/ResponsePage.jsx';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        richColors
      />
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/response" element={<ResponsePage />} />
      </Routes>
    </Router>
  );
}

export default App;
