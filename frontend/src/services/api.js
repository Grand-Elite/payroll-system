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