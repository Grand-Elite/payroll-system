import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEmployeeById } from '../../../services/api';

function ViewEmployee() {
    const { employeeId } = useParams();
    const [employeeData, setEmployeeData] = useState({
        shortName: '',
        fullName: '',
        department: null,
        designation: '',
        nicNo: '',
        employeeType: '',
        epfNo: '',
        joiningDate: ''
    });


    const [error, setError] = useState(null);

    useEffect(() => {
        if (employeeId) {
            const fetchEmployeeDetails = async () => {
                try {
                    const data = await getEmployeeById(employeeId);
                    setEmployeeData(data);
                    setError(null);
                } catch (error) {
                    console.error('Error fetching employee details:', error);
                    setError('Failed to fetch employee details');
                }
            };
            fetchEmployeeDetails();
        }
    }, [employeeId]);

    const formatValue = (value) => value || '-';

    return (
        <div className="form-container" style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
            <div className="employee-details">
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className='employee-detail' style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px dashed #ccc' }}>
                    <label style={{ display: 'inline-block', width: '200px' }}><strong>Employee ID:</strong></label>
                    <span>{employeeId}</span>
                </div>

                <div className='employee-detail' style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px dashed #ccc' }}>
                    <label style={{ display: 'inline-block', width: '200px' }}><strong>Employee Short Name:</strong></label>
                    <span>{formatValue(employeeData.shortName)}</span>
                </div>

                <div className='employee-detail' style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px dashed #ccc' }}>
                    <label style={{ display: 'inline-block', width: '200px' }}><strong>Full Name:</strong></label>
                    <span>{formatValue(employeeData.fullName)}</span>
                </div>

                <div className='employee-detail' style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px dashed #ccc' }}>
                    <label style={{ display: 'inline-block', width: '200px' }}><strong>Department:</strong></label>
                    <span>{formatValue(employeeData.department ? employeeData.department.name : 'Not assigned')}</span>
                </div>

                <div className='employee-detail' style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px dashed #ccc' }}>
                    <label style={{ display: 'inline-block', width: '200px' }}><strong>Designation:</strong></label>
                    <span>{formatValue(employeeData.designation)}</span>
                </div>

                <div className='employee-detail' style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px dashed #ccc' }}>
                    <label style={{ display: 'inline-block', width: '200px' }}><strong>NIC No:</strong></label>
                    <span>{formatValue(employeeData.nicNo)}</span>
                </div>

                <div className='employee-detail' style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px dashed #ccc' }}>
                    <label style={{ display: 'inline-block', width: '200px' }}><strong>Employee Type:</strong></label>
                    <span>{formatValue(employeeData.employeeType)}</span>
                </div>

                {employeeData.employeeType === 'PERMANENT' && (
                    <div className='employee-detail' style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px dashed #ccc' }}>
                        <label style={{ display: 'inline-block', width: '200px' }}><strong>EPF No:</strong></label>
                        <span>{formatValue(employeeData.epfNo)}</span>
                    </div>
                )}

                <div className='employee-detail' style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px dashed #ccc' }}>
                    <label style={{ display: 'inline-block', width: '200px' }}><strong>Joining Date:</strong></label>
                    <span>{formatValue(employeeData.joiningDate)}</span>
                </div>
            </div>
        </div>
    );
}

export default ViewEmployee;
