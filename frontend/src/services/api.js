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