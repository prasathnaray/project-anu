import axios from 'axios';
import APP_URL from './config';

export const getInstructorsPerBatch = async (peopleId, token) => {
  try {
    const query = peopleId ? `?people_id=${encodeURIComponent(peopleId)}` : '';
    const response = await axios.get(`${APP_URL}/api/v1/instructor-as-per-batch${query}`, {
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
