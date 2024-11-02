import Employee from './components/Employee/Employee';
import AddNewEmployee from './components/Employee/AddNewEmployee/AddNewEmployee';

import Sidebar from './components/Sidebar/Sidebar';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';

import './App.css';
import UploadAttendanceExcel from './components/Attendance/UploadAttendanceExcel/UploadAttendanceExcel';

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
            <Route path="/add-new-employee" element={<AddNewEmployee />}/>
            <Route path="/upload-attendance-excel" element={<UploadAttendanceExcel />}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
