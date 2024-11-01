import Employee from './components/Employee/Employee';
import Sidebar from './components/Sidebar/Sidebar';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';

import './App.css';

function App() {
  return (
    <Router>
      <div className="container">
        <Sidebar />
        <div className="content">
          <header>
            <div className="logo">Logo</div>
            <div className="title">
              <h1>GRAND ELITE</h1>
            </div>
            <div className="date">Month - Year</div>
          </header>
          <Routes>
            <Route path="/" element={<Navigate to="/employee" replace />} />
            <Route path="/employee" element={<Employee />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
