import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [employees, setEmployees] = useState([]); // State to hold employee data
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch employees data from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/api/employee');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="container">
      <div className="sidebar">
        <button>Employee</button>
        <button>Attendance</button>
        <button>Salary</button>
        <button>Salary Update</button>
        <button>Pay Slip</button>
        <button>EPF</button>
        <button>ETF</button>
        <button>Service Charges</button>
        <button>Summary</button>
      </div>
      <div className="content">
        <header>
          <div className="logo">Logo</div>
          <div className="title">
            <h1>GRAND ELITE</h1>
            <h2>SALARY PAYMENTS</h2>
          </div>
          <div className="date">Month - Year</div>
        </header>
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Department</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="15" style={{ textAlign: 'center' }}>Loading...</td>
              </tr>
            ) : employees.length > 0 ? (
              employees.map((employee) => (
                <tr key={employee.employeeId}>
                  <td>{employee.employeeId}</td>
                  <td>{employee.department.name}</td>
                  <td>{employee.shortName}</td>
                  <td>
                    <button>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="15" style={{ textAlign: 'center' }}>No Data</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="buttons">
          <button>Add New Employee</button>
          <button>Update Employee</button>
          <button>Shift Assign</button>
        </div>
      </div>
    </div>
  );
}

export default App;
