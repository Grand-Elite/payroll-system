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

  export const fetchAttendance = async (employeeId) => {
    try {
      const response =await axios.get(`${API_BASE_URL}/employee/${employeeId}/attendance`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee attendance:', error);
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
    const response = await axios.patch("api/attendance/overwritten-attendance", {
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







export {updateAttendanceStatus };

