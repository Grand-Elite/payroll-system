import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/employee">
        <button>Employee</button>
      </Link>
      <Link to="/attendance">
        <button>Attendance</button>
      </Link>
      <Link to="/shift">
        <button>Shift</button>
      </Link>

      <Link to="/salary-base">
        <button>Salary Base</button>
      </Link>

      <Link to="/monthly-salary">
      <button>Monthly Salary</button>
      </Link>

      <Link to="/leaves">
      <button>Leaves</button>
      </Link>


      <Link to="/holiday-calendar">
      <button>Holiday Calendar</button>
      </Link>

      <Link to="/epf">
      <button>EPF</button>
      </Link>
      
      <button>ETF</button>
      <button>Service Charges</button>

      <Link to="/salary-payment-summary">
      <button>Salary Payment Summary</button>
      </Link>
    </div>
  );
}

export default Sidebar;
