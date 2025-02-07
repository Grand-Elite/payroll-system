import React, { useEffect, useState } from 'react';
import { fetchEmployees, deactivateEmployee } from '../../services/api'; // Import API services
import { Link } from 'react-router-dom';
import './Employee.css';

function Employee() {
  const [employees, setEmployees] = useState([]); // State to hold employee data
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch employees data from API
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetchEmployees();
        // Filter only employees with 'ACTIVE' status
        const activeEmployees = response.filter(employee => employee.status === 'ACTIVE');
        setEmployees(activeEmployees);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  const handleDeactivate = async (employeeId) => {
    // Ask for confirmation
    const confirm = window.confirm("Are you sure you want to delete this employee?");
    if (!confirm) return; // If user cancels, exit the function

    try {
      await deactivateEmployee(employeeId); // Call API to deactivate employee
      // Remove the deactivated employee from the list
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.employeeId !== employeeId)
      );
    } catch (error) {
      console.error('Error deleting the employee:', error);
    }
  };

  
  return (
    <div>
      <header>
        <h2>Employee Details</h2>
      </header>
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>EPF No.</th>
            <th>Short Name</th>
            <th>Full Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>NIC No.</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>Loading...</td>
            </tr>
          ) : employees.length > 0 ? (
            employees.map((employee) => (
              <tr key={employee.employeeId}>
                <td>{employee.employeeId}</td>
                <td>{employee.epfNo}</td>
                <td>{employee.shortName}</td>
                <td>{employee.fullName}</td>
                <td>{employee.department.name}</td>
                <td>{employee.designation}</td>
                <td>{employee.nicNo}</td>
                <td>
                  {employee.status === 'ACTIVE' ? (
                    <div>
                        <button className="btn btn-danger btn-custom-delete" onClick={() => handleDeactivate(employee.employeeId)} >
                          Delete
                        </button>
                        <Link to={`/update-employee/${employee.employeeId}`}>
                        <button className="btn-custom-update" style={{ marginLeft: '10px' }}>
                        Update
                      </button>
                      </Link>
                      <Link to={`/view-employee/${employee.employeeId}`}>
                        <button className="btn-custom-update" style={{ marginLeft: '10px' , backgroundColor:'green', paddingInline:'15px'}}>
                        View
                      </button>
                      </Link>
                      <Link to={`/update-employee/${employee.employeeId}`}>
                        <button className="btn-custom-update" style={{ marginLeft: '10px' , backgroundColor:"#343a40"}}>
                       Notes
                      </button>
                      </Link>
                    </div>
                  ) : (
                    <span>Inactive</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No Data</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="buttons" style={{ marginTop: '20px' }}>
        <Link to="/add-new-employee">
          <button>Add New Employee</button>
        </Link>
       
      </div>
    </div>
  );
}

export default Employee;