import axios from 'axios';
import APP_URL from './config';

export const getInstructorsPerBatch = async (peopleId, token) => {
  try {
    const response = await axios.get(`${APP_URL}/api/v1/instructor-as-per-batch?people_id=${peopleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching instructors per batch:', error);
    throw error;
  }
};