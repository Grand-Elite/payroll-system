import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/employee">
        <button>Employee</button>
      </Link>
      <Link to="/upload-attendance-excel">
        <button>Attendance</button>
      </Link>
      <button>Salary</button>
      <button>Salary Update</button>
      <button>Pay Slip</button>
      <button>EPF</button>
      <button>ETF</button>
      <button>Service Charges</button>
      <button>Summary</button>
    </div>
  );
}

export default Sidebar;
