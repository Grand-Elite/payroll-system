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


/*
import React, { useState } from 'react';
import { addEmployee } from '../../../services/api'; // Adjust the import path as necessary

function AddNewEmployee() {
    const [shortName, setShortName] = useState('');
    const [fullName, setFullName] = useState('');
    const [department, setDepartment] = useState(null);
    const [designation, setDesignation] = useState('');
    const [nicNo, setNicNo] = useState('');
    const [employeeType, setEmployeeType] = useState('');
    const [epfNo, setEpfNo] = useState('');

    const departments = [
        { departmentId: 1, name: 'Kitchen' },
        { departmentId: 2, name: 'Steward' },
        { departmentId: 3, name: 'Back Office' },
        { departmentId: 4, name: 'Front Office' },
        { departmentId: 5, name: 'Cleaning & Maintenance' }
    ];

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const employeeData = {
            employeeId,
            shortName,
            fullName,
            department,
            designation,
            nicNo,
            employeeType,
            epfNo: employeeType === 'PERMANENT' ? epfNo : '', // Include EPF No if Permanent
            status: "ACTIVE"
        };

        console.log('Employee Data:', employeeData);

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
        setFullName('');
        setDepartment(null);
        setDesignation('');
        setNicNo('');
        setEmployeeType('');
        setEpfNo('');
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className='add-new-employee'>
                    <label>
                        <span>Employee Short Name:</span>
                        <input
                            type="text"
                            value={shortName}
                            onChange={(e) => setShortName(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div className='add-new-employee'>
                    <label>
                        <span>Full Name:</span>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div className='add-new-employee'>
                    <label>
                        <span>Department:</span>
                        <select
                            value={department ? department.departmentId : ''}
                            onChange={(e) => {
                                const selectedDept = departments.find(dept => dept.departmentId === Number(e.target.value));
                                setDepartment(selectedDept || null);
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

                <div className='add-new-employee'>
                    <label>
                        <span>Designation:</span>
                        <input
                            type="text"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div className='add-new-employee'>
                    <label>
                        <span>NIC No:</span>
                        <input
                            type="text"
                            value={nicNo}
                            onChange={(e) => setNicNo(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div className='add-new-employee'>
                    <label>
                        <span>Employee Type:</span>
                        <select
                            value={employeeType}
                            onChange={(e) => {
                                setEmployeeType(e.target.value);
                                if (e.target.value !== 'PERMANENT') {
                                    setEpfNo(''); // Clear EPF No if not Permanent
                                }
                            }}
                            required
                        >
                            <option value="">Select employee type</option>
                            <option value="PERMANENT">Permanent</option>
                            <option value="TEMPORARY">Temporary</option>
                        </select>
                    </label>
                </div>

                
                {employeeType === 'PERMANENT' && (
                    <div className='add-new-employee'>
                        <label>
                            <span>EPF No:</span>
                            <input
                                type="text"
                                value={epfNo}
                                onChange={(e) => setEpfNo(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                )}

                <button type="submit" className="add-button">Add</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </form>
        </div>
    );
};

export default AddNewEmployee;
*/

import React, { useState, useEffect } from 'react';
import { addEmployee, getLastEmployeeId } from '../../../services/api'; // Adjust the import path as necessary

function AddNewEmployee() {
    const [employeeId, setEmployeeId] = useState(''); // New state for Employee ID input
    const [shortName, setShortName] = useState('');
    const [fullName, setFullName] = useState('');
    const [department, setDepartment] = useState(null);
    const [designation, setDesignation] = useState('');
    const [nicNo, setNicNo] = useState('');
    const [employeeType, setEmployeeType] = useState('');
    const [epfNo, setEpfNo] = useState('');
    const [lastEmployeeId, setLastEmployeeId] = useState(null); // State for displaying the last employee ID

    const departments = [
        { departmentId: 1, name: 'Kitchen' },
        { departmentId: 2, name: 'Steward' },
        { departmentId: 3, name: 'Back Office' },
        { departmentId: 4, name: 'Front Office' },
        { departmentId: 5, name: 'Cleaning & Maintenance' }
    ];

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        // Fetch the last employee ID on component mount
        const fetchLastEmployeeId = async () => {
            try {
                const lastId = await getLastEmployeeId();
                setLastEmployeeId(lastId);
            } catch (error) {
                console.error('Error fetching last employee ID:', error);
            }
        };
        fetchLastEmployeeId();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const employeeData = {
            employeeId,
            shortName,
            fullName,
            department,
            designation,
            nicNo,
            employeeType,
            epfNo: employeeType === 'PERMANENT' ? epfNo : '', // Include EPF No if Permanent
            status: "ACTIVE"
        };

        console.log('Employee Data:', employeeData);

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
        setEmployeeId('');
        setShortName('');
        setFullName('');
        setDepartment(null);
        setDesignation('');
        setNicNo('');
        setEmployeeType('');
        setEpfNo('');
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className='add-new-employee'>
                    <label>
                        <span>Last Employee ID: {lastEmployeeId !== null ? lastEmployeeId : 'Loading...'}</span>
                    </label>
                </div>

                <div className='add-new-employee'>
                    <label>
                        <span>Employee ID:</span>
                        <input
                            type="text"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div className='add-new-employee'>
                    <label>
                        <span>Employee Short Name:</span>
                        <input
                            type="text"
                            value={shortName}
                            onChange={(e) => setShortName(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div className='add-new-employee'>
                    <label>
                        <span>Full Name:</span>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div className='add-new-employee'>
                    <label>
                        <span>Department:</span>
                        <select
                            value={department ? department.departmentId : ''}
                            onChange={(e) => {
                                const selectedDept = departments.find(dept => dept.departmentId === Number(e.target.value));
                                setDepartment(selectedDept || null);
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

                <div className='add-new-employee'>
                    <label>
                        <span>Designation:</span>
                        <input
                            type="text"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div className='add-new-employee'>
                    <label>
                        <span>NIC No:</span>
                        <input
                            type="text"
                            value={nicNo}
                            onChange={(e) => setNicNo(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div className='add-new-employee'>
                    <label>
                        <span>Employee Type:</span>
                        <select
                            value={employeeType}
                            onChange={(e) => {
                                setEmployeeType(e.target.value);
                                if (e.target.value !== 'PERMANENT') {
                                    setEpfNo(''); // Clear EPF No if not Permanent
                                }
                            }}
                            required
                        >
                            <option value="">Select employee type</option>
                            <option value="PERMANENT">Permanent</option>
                            <option value="TEMPORARY">Temporary</option>
                        </select>
                    </label>
                </div>

                {employeeType === 'PERMANENT' && (
                    <div className='add-new-employee'>
                        <label>
                            <span>EPF No:</span>
                            <input
                                type="text"
                                value={epfNo}
                                onChange={(e) => setEpfNo(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                )}

                <button type="submit" className="add-button">Add</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </form>
        </div>
    );
}

export default AddNewEmployee;
