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

      <button>Salary</button>

      <Link to="/salary-updates">
        <button>Salary Updates</button>
      </Link>
        
      

      <button>Pay Slip</button>
      <button>EPF</button>
      <button>ETF</button>
      <button>Service Charges</button>
      <button>Summary</button>
    </div>
  );
}

export default Sidebar;
