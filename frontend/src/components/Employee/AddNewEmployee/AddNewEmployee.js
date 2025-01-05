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
    const [joiningDate, setJoiningDate] = useState(''); // New state for Joining Date input
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
            setLastEmployeeId(lastId || 0); // If lastId is null or undefined, set it to 0
            setEmployeeId((lastId || 0) + 1); // Set the next employee ID
        } catch (error) {
            console.error('Error fetching last employee ID:', error);
            setLastEmployeeId(0); // Set lastEmployeeId to 0 in case of an error
            setEmployeeId(1); // Start from 1 if there’s an error
        }
    };
    fetchLastEmployeeId();
}, []);

const validateNIC = (nicNumber) => {
    const nicRegex = /^([1-9][0-9]{11}|[1-9][0-9]{9}|[0-9]{9}[vVxX])$/;
    return nicRegex.test(nicNumber);
};

const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate NIC only if a value is provided
    if (nicNo && !validateNIC(nicNo)) {
        setError('Invalid NIC number format!');
        return;
    }

    // Reset error if NIC is valid or empty
    setError(null);

    const employeeData = {
        employeeId: employeeId || (lastEmployeeId + 1), // Auto-generate employee ID based on last employee ID
        shortName,
        fullName,
        department,
        designation,
        nicNo, // Include NIC only if entered
        employeeType,
        epfNo: employeeType === 'PERMANENT' ? epfNo : '', // Include EPF No if Permanent
        joiningDate, // Include Joining Date
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

    // Clear the form after submission
    setEmployeeId('');
    setShortName('');
    setFullName('');
    setDepartment(null);
    setDesignation('');
    setNicNo('');
    setEmployeeType('');
    setEpfNo('');
    setJoiningDate('');
};


    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className='add-new-employee'>
                    <label>
                       {/* <span>Last Employee ID: {lastEmployeeId !== null ? lastEmployeeId : 'Loading...'}</span> */}
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

                <div className='add-new-employee'>
                    <label>
                        <span>Joining Date:</span>
                        <input
                            type="date"
                            value={joiningDate}
                            onChange={(e) => setJoiningDate(e.target.value)}
                        />
                    </label>
                </div>

                <button type="submit" className="add-button">Add</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </form>
        </div>
    );
}

export default AddNewEmployee;
