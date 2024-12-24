import axios from 'axios';


const API_BASE_URL = 'http://localhost:3000/api';

export const fetchEmployees = async () => {
  try {
    const response =await axios.get(`${API_BASE_URL}/employee`);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

// API function to fetch shifts by departmentId
export const fetchShiftsByDepartment = (departmentId) => {
  return axios.get(`/api/shifts/department/${departmentId}`);
};

export const addEmployee = async (employeeData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/employee`, employeeData);
      return response.data; // Return the response data for further handling if needed
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error adding employee');
    }
  };

  export const uploadAttendanceFile = async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post("/api/attendance/upload-excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  export const fetchAttendance = async (employeeId,selectedYear,selectedMonth) => {
    try {
      const response =await axios.get(`${API_BASE_URL}/employee/${employeeId}/attendance/${selectedYear}/${selectedMonth}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee attendance:', error);
      throw error;
    }
  };

  export const fetchAttendanceSummary = async (employeeId,selectedYear,selectedMonth) => {
    try {
      const response =await axios.get(`${API_BASE_URL}/employee/${employeeId}/attendance-summary/${selectedYear}/${selectedMonth}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee attendance summary:', error);
      throw error;
    }
  };

  export const getLastEmployeeId = async () => {
    try {
        const response = await axios.get('/api/employee/last-id'); // Adjust the endpoint as necessary
        return response.data.employeeId;
    } catch (error) {
        console.error("Error fetching last employee ID:", error);
        throw error;
    }
};


const updateAttendanceStatus = async (
  employeeId,date,
  attendanceRecordId,
  updatedStatus,
  updatedLcEarlyClockoutMins,
  updatedLcLateClockinMins,
  otEarlyClockinMins,
  otLateClockoutMins,
  updatedTotalLcMins,
  updatedTotalOtMins
) => {
  try {
    const response = await axios.patch(`api/employee/${employeeId}/attendance/${date}/overwritten-attendance`, {
      attendanceRecordId,
      updatedAttendanceStatus: updatedStatus,
      updatedLcEarlyClockoutMins,
      updatedLcLateClockinMins,
      updatedOtEarlyClockinMins: otEarlyClockinMins,
      updatedOtLateClockoutMins: otLateClockoutMins,
      updatedTotalLcMins,
      updatedTotalOtMins,
    });
    console.log("Update Successful:", response.data);
  } catch (error) {
    console.error("Error updating attendance:", error);
  }
};



export const updateSalaryDetails = async (employeeId, salaryDetails) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/salaryBase/${employeeId}`,
      salaryDetails,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Error updating salary details in API:', error);
    throw error;
  }
};


// Create new salary details if no record exists
export const createSalaryDetails = async (employeeId, salaryDetails) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/salaryBase/${employeeId}`,
      salaryDetails,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating salary details in API:', error);
    throw error;
  }
};



export const updateShift = async (id, shiftData) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/shifts/${id}`, shiftData);
    return response.data;
  } catch (error) {
    console.error('Error updating shift:', error);
    throw error;
  }
};



// Deactivate an employee by sending a PATCH request
export const deactivateEmployee = async (employeeId) => {
  await axios.patch(`/api/employee/${employeeId}/deactivate`);
};

export const updateEmployee = async (employeeId, updatedData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/employee/${employeeId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};




export const getEmployeeById = async (employeeId) => {
  try {
    const response = await fetch(`/api/employee/${employeeId}`); // Ensure the endpoint is correct
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    
    const data = await response.json(); // Assuming the response body is JSON
    return data;
  } catch (error) {
    console.error('Error fetching employee details:', error);
    throw error; // Re-throw the error for higher-level handling
  }
};


export const getSalaryDetailByEmployeeId = async (employeeId) =>{
  try {
    const response = await fetch(`/api/salaryBase/${employeeId}`);
    if(!response.ok){
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching salary details:',error);
    throw error;
  }
};





export const getMonthlyFullSalary = async (employeeId, year, month) => {
  try {
    const response = await fetch(
      `/api/employee/${employeeId}/monthly-full-salary/year/${year}/month/${month}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch salary details');
    }

    const textResponse = await response.text();
    return textResponse ? JSON.parse(textResponse) : {};
  } catch (error) {
    console.error('Error fetching monthly full salary:', error);
    return {};
  }
};


export const saveHolidays = (holidays) => {
  return fetch("/api/holidays", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      Object.entries(holidays).map(([date, holidayData]) => {
        const localDate = new Date(date);

        // Manually adjust to UTC time to avoid shifting the day
        const utcDate = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()));

        return {
          holidayDate: utcDate.toISOString(), // Send as UTC ISO string
          description: holidayData.description || '', // Extract description
          mandatory: holidayData.mandatory || false,  // Extract mandatory status
        };
      })
    ),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Failed to save holidays");
    }
  });
};


// Function to fetch all holidays from the backend
export const fetchHolidays = () => {
  return fetch("/api/holidays")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch holidays");
      }
    })
    .catch((error) => {
      console.error("Error fetching holidays:", error);
      throw error;
    });
};


export const deleteHoliday = (formattedDate) => {
  return fetch(`/api/holidays/${formattedDate}`, {
    method: "DELETE",
  })
    .then((response) => {
      // Check if the response status is 204 (No Content)
      if (response.status === 204) {
        console.log("Holiday deleted successfully");
      } else {
        throw new Error("Failed to delete holiday");
      }
    })
    .catch((error) => {
      console.error("Error deleting holiday:", error);
      alert("Error deleting holiday: " + error.message);
    });
};


// Function to create monthly salary update
export const createMonthlySalaryUpdate = async (employeeId, year, month, salaryUpdateData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/monthly-salary-updates/${employeeId}/${year}/${month}`, salaryUpdateData);
    return response; // Return the response from the API
  } catch (error) {
    console.error('Error creating monthly salary update:', error);
    throw error; // Propagate the error for handling in the calling function
  }
};

export const updateMonthlySalaryUpdate = async (employeeId, year, month, salaryData) => {
  try {
    console.log('Year:', year, 'Month:', month);  // Debugging log
    console.log('API URL:', `${API_BASE_URL}/monthly-salary-updates/${employeeId}/${year}/${month}`); // Debugging URL
    console.log('Salary Data:', salaryData); // Debugging salary data

    const response = await axios.patch(
      `${API_BASE_URL}/monthly-salary-updates/${employeeId}/${year}/${month}`,
      salaryData,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response;
  } catch (error) {
    console.error('Error updating monthly salary:', error.response?.data || error.message);
    throw error; // Throw error so it can be caught in the component
  }
};

export const getMonthlySalaryDetails = async (employeeId, year, month) => {
  try {
    const response = await fetch(`/api/monthly-salary-updates/${employeeId}/${year}/${month}`);
    
    // Check if response is successful
    if (!response.ok) {
      console.error(`Failed to fetch monthly salary details: ${response.statusText}`);
      return {}; // Return empty object if response is not OK
    }

    const data = await response.json();

    // Ensure the response data is an object, fallback to an empty object
    return data || {};
  } catch (error) {
    console.error('Error fetching monthly salary details:', error);
    return {}; // Return empty object in case of error
  }
};


export const fetchLeaveDetails = async (employeeId, year) => {
  try {
    const response = await axios.get(`/api/leave-details`, {
      params: { employeeId, year },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null; // Return null if no record is found
    }
    throw new Error(`Error fetching leave details: ${error.response?.data || error.message}`);
  }
};

export const saveLeaveDetails = async ({ employeeId, year, annual, casual, medical }) => {
  try {
    // Ensure the leaveDetails object matches the backend's expected structure
    const leaveDetails = {
      employee: {
        employeeId, // Nested employeeId inside an employee object
      },
      year,
      annual,
      casual,
      medical,
    };

    const response = await axios.post(`/api/leave-details`, leaveDetails);
    return response.data;
  } catch (error) {
    throw new Error(`Error saving leave details: ${error.response?.data || error.message}`);
  }
};


export const saveLeaveUsage = async ({
  employeeId,
  annualLeaves = 0,
  medical = 0,
  casual = 0,
  abOnPublicHoliday = 0,
  other = 0,
  noPayLeaves = 0,
  monthlyMandatoryLeaves = 0,
  year,
  month,
}) => {
  try {
    const leaveUsage = {
      employee: {
        employeeId,
      },
      annualLeaves,
      medical,
      casual,
      abOnPublicHoliday,
      other,
      noPayLeaves,
      monthlyMandatoryLeaves,
      year,
      month,
    };

    console.log("Payload being sent:", leaveUsage);

    const response = await axios.post(`/api/leave-usage`, leaveUsage);
    return response.data;
  } catch (error) {
    throw new Error(
      `Error saving leave details: ${error.response?.data || error.message}`
    );
  }
};

export {updateAttendanceStatus };