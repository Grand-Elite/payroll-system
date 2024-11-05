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

  /*
export const updateAttendanceStatus = async (employeeId, date, status) => {
  try {
    const response = await axios.patch("/api/attendance/overwritten-attendance", {
      employeeId,
      date,
      attendanceStatus: status,
    });
    return response.data; // Return the response data if needed
  } catch (error) {
    throw new Error('Failed to update attendance status: ' + error.message);
  }
};
*/


const updateAttendanceStatus = async (attendanceRecordId, updatedStatus) => {
    try {
        const response = await axios.patch("api/attendance/overwritten-attendance", {
            attendanceRecordId,
            updatedAttendanceStatus: updatedStatus
        });
        console.log("Update Successful:", response.data);
    } catch (error) {
        console.error("Error updating attendance:", error);
    }
};

export { updateAttendanceStatus };

