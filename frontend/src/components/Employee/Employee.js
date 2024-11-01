import React, { useEffect, useState } from 'react';
import { fetchEmployees } from '../../services/api';
import './Employee.css'
function Employee() {
    const [employees, setEmployees] = useState([]); // State to hold employee data
    const [loading, setLoading] = useState(true); // Loading state
  
    // Fetch employees data from API
    useEffect(() => {
      const fetchEmployeeData = async () => {
        try {
          const response = await fetchEmployees();
          setEmployees(response);
        } catch (error) {
          console.error('Error fetching employee data:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchEmployeeData();
    }, []);
  
    return (
        <div>
            <header>
                <h2>Employee Details</h2>
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
    );
}
export default Employee;
