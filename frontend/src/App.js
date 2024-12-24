import Employee from './components/Employee/Employee';
import AddNewEmployee from './components/Employee/AddNewEmployee/AddNewEmployee';
import UpdateEmployee from './components/Employee/UpdateEmployee/UpdateEmployee';
import ViewEmployee from './components/Employee/ViewEmployee/ViewEmployee';
//import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar/Sidebar';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';

import './App.css';
import UploadAttendanceExcel from './components/Attendance/UploadAttendanceExcel/UploadAttendanceExcel';
import Attendance from './components/Attendance/Attendance';
import Shift from './components/Shift/Shift'
import SalaryBase from './components/Salary/SalaryBase';
import MonthlySalary from './components/Salary/MonthlySalary';
import HolidayCalendar from './components/Holiday/HolidayCalendar';
import Leaves from './components/Leaves/Leaves'

//import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import dayjs from 'dayjs';
import {
  Select,
  MenuItem,
  FormControl
} from '@mui/material';



function App() {
  // State for selected month and year
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("MMMM"));
  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentYear = dayjs().year();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  return (
    <Router>
      <div className="container">
        <Sidebar />
        <div className="content">
          <header>
            <div className="logo"><img src="/favicon.ico" alt="Company Logo" /></div>
            <div className="title">
              <h1>GRAND ELITE</h1>
            </div>
            <FormControl style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: '1rem', // Adjust gap between elements
                          }}>
              <Select
                value={selectedMonth}
                label="Month"
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                  {months.map((month, index) => (
                    <MenuItem key={index} value={month}>{month}</MenuItem>
                  ))}
              </Select>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map((year, index) => (
                    <MenuItem key={index} value={year}>{year}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </header>
          <Routes>
            <Route path="/" element={<Navigate to="/employee" replace />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/add-new-employee" element={<AddNewEmployee />}/>
            <Route path="/update-employee/:employeeId" element={<UpdateEmployee />}/>
            <Route path="/view-employee/:employeeId" element={<ViewEmployee />}/>
            <Route path="/attendance" element={<Attendance selectedMonth={selectedMonth} selectedYear={selectedYear}/>}/>
            <Route path="/upload-attendance-excel" element={<UploadAttendanceExcel />}/>
            <Route path="/shift" element={<Shift />}/>
            <Route path="/monthly-salary" element={<MonthlySalary selectedMonth={selectedMonth} selectedYear={selectedYear} />} />
            <Route path="/salary-base" element={<SalaryBase selectedMonth={selectedMonth} selectedYear={selectedYear} />} />
            <Route path="/holiday-calendar" element={<HolidayCalendar />}/>
            <Route path="/leaves" element={<Leaves  selectedYear={selectedYear} />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
