/*
import React, { useState } from 'react';
import { addEmployee } from '../../../services/api'; // Adjust the import path as necessary

function AddNewEmployee() {
    const [shortName, setShortName] = useState('');
  const [department, setDepartment] = useState(null); // Initialize as null
  const [departments] = useState([
    { departmentId: 1, name: 'Kitchen'}
    
  ]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const employeeData = {
      shortName,
      department,
      employeeType:"PERMANENT",
      status: "ACTIVE"
    };

    try {
      const responseData = await addEmployee(employeeData);
      console.log('Employee added:', responseData);
      setSuccess('Employee added successfully!');
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      setSuccess(null);
    }

    // Clear the form
    setShortName('');
    setDepartment(null); // Reset department selection
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Employee Short Name:
          <input
            type="text"
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Department:
          <select
            value={department ? department.departmentId : ''} // Use department ID for select value
            onChange={(e) => {
              const selectedDept = departments.find(dept => dept.departmentId === Number(e.target.value));
              setDepartment(selectedDept || null); // Set the selected department object
            }}
            required
          >
            <option value="">Select a department</option>
            {departments.map((dept) => (
              <option key={dept.departmentId} value={dept.departmentId}>
                {dept.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit">Add</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
};

export default AddNewEmployee;
*/



import React, { useState } from 'react';
import { addEmployee } from '../../../services/api'; // Adjust the import path as necessary

function AddNewEmployee() {
    const [shortName, setShortName] = useState('');
    const [department, setDepartment] = useState(null); // Initialize as null
    const [departments] = useState([
        { departmentId: 1, name: 'Kitchen'},
        { departmentId: 2, name: 'Steward'},
        { departmentId: 3, name: 'Cleaning and Maintaintance'},
        { departmentId: 4, name: 'Office'},
        { departmentId: 5, name: 'Cashier and Barman'}
  ]);
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const employeeData = {
      shortName,
      department,
      employeeType:"PERMANENT",
      status: "ACTIVE"
    };

    console.log('Employee Data:', employeeData); // Log employee data

    try {
      const responseData = await addEmployee(employeeData);
      console.log('Employee added:', responseData);
      setSuccess('Employee added successfully!');
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      setSuccess(null);
    }

    // Clear the form
    setShortName('');
    setDepartment(null); // Reset department selection
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Employee Short Name:
          <input
            type="text"
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Department:
          <select
            value={department ? department.departmentId : ''} // Use department ID for select value
            onChange={(e) => {
              const selectedDept = departments.find(dept => dept.departmentId === Number(e.target.value));
              setDepartment(selectedDept || null); // Set the selected department object
            }}
            required
          >
            <option value="">Select a department</option>
            {departments.map((dept) => (
              <option key={dept.departmentId} value={dept.departmentId}>
                {dept.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit">Add</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
};

export default AddNewEmployee;

