import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // Import useParams
import { getEmployeeById} from '../../../services/api';

function UpdateEmployee() {
    const { employeeId } = useParams();  // Extract employeeId from URL
    const [employeeData, setEmployeeData] = useState({
        shortName: '',
        fullName: '',
        department: null,
        designation: '',
        nicNo: '',
        employeeType: '',
        epfNo: '',
    });

    const departments = [
        { departmentId: 1, name: 'Kitchen' },
        { departmentId: 2, name: 'Steward' },
        { departmentId: 3, name: 'Back Office' },
        { departmentId: 4, name: 'Front Office' },
        { departmentId: 5, name: 'Cleaning & Maintenance' }
    ];

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Fetch employee details when employeeId changes
    useEffect(() => {
        console.log(employeeId);  // Check if employeeId is correctly extracted
        if (employeeId) {
            const fetchEmployeeDetails = async () => {
                try {
                    const data = await getEmployeeById(employeeId);
                    console.log(data);  // Log data to verify the structure
                    setEmployeeData(data);  // Pre-fill form fields with fetched data
                    setSuccess(null); // Reset success message
                } catch (error) {
                    console.error('Error fetching employee details:', error);
                    setError('Failed to fetch employee details');
                }
            };
            fetchEmployeeDetails();  // Call the function to fetch employee data
        }
    }, [employeeId]);  // Run this effect when employeeId changes

    // Handle input changes to update state
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData({ ...employeeData, [name]: value });
    };

            // Handle form submission for updating employee details
        const handleSubmit = async (e) => {
            e.preventDefault();
            
            try {
                // Make a PATCH request to update the employee details
                const response = await fetch(`/api/employee/${employeeId}`, {
                    method: 'PATCH',  // Use PATCH for partial updates
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(employeeData), // Send updated employee data
                });

                if (response.ok) {
                    setSuccess('Employee updated successfully!');
                    setError(null);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Failed to update employee details');
                }
            } catch (error) {
                console.error('Error updating employee:', error);
                setError('Failed to update employee details');
            }
        };

        const handleUpdate = (employeeId) => {
            // Ask for confirmation
            const confirm = window.confirm("Are you sure you want to update this employee's details?");
            if (!confirm) return; // If user cancels, exit the function
        
            // If confirmed, show a success message (this can be replaced with a real API call later)
            setSuccess('Employee details updated successfully!');
        };
        
        

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className='add-new-employee'>
                    <label>
                        <span>Employee ID:</span>
                        <input
                            type="text"
                            value={employeeId}  // This is now automatically filled from the URL
                            readOnly  // Make the input readonly so user can't change it
                        />
                    </label>
                </div>

                <div className='add-new-employee'>
                    <label>
                        <span>Employee Short Name:</span>
                        <input
                            type="text"
                            name="shortName"
                            value={employeeData.shortName}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>

                <div className='add-new-employee'>
                    <label>
                        <span>Full Name:</span>
                        <input
                            type="text"
                            name="fullName"
                            value={employeeData.fullName}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>

                <div className='add-new-employee'>
                    <label>
                        <span>Department:</span>
                        <select
                            name="department"
                            value={employeeData.department ? employeeData.department.departmentId : ''}
                            onChange={(e) => {
                                const selectedDept = departments.find(dept => dept.departmentId === Number(e.target.value));
                                setEmployeeData({ ...employeeData, department: selectedDept || null });
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
                            name="designation"
                            value={employeeData.designation}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>

                <div className='add-new-employee'>
                    <label>
                        <span>NIC No:</span>
                        <input
                            type="text"
                            name="nicNo"
                            value={employeeData.nicNo}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>

                <div className='add-new-employee'>
                    <label>
                        <span>Employee Type:</span>
                        <select
                            name="employeeType"
                            value={employeeData.employeeType}
                            onChange={(e) => {
                                setEmployeeData({ ...employeeData, employeeType: e.target.value });
                                if (e.target.value !== 'PERMANENT') {
                                    setEmployeeData({ ...employeeData, epfNo: '' }); // Clear EPF No if not Permanent
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

                {employeeData.employeeType === 'PERMANENT' && (
                    <div className='add-new-employee'>
                        <label>
                            <span>EPF No:</span>
                            <input
                                type="text"
                                name="epfNo"
                                value={employeeData.epfNo}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                    </div>
                )}

                <button type="submit" className="add-button" onClick={() => handleUpdate(employeeId)}>Update</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </form>
        </div>
    );
}

export default UpdateEmployee;    