import axios from 'axios';
import APP_URL from './config';

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export const getMindSparkQuestionsAPI = (token, resourceId, mindsparkNo = '') => {
  const params = new URLSearchParams({ resource_id: resourceId });
  if (mindsparkNo !== '') {
    params.append('mindspark_no', mindsparkNo);
  }

  return axios.get(`${APP_URL}/api/v1/mind-spark-questions?${params.toString()}`, {
    headers: authHeaders(token),
  });
};

export const saveMindSparkQuestionsAPI = (token, payload) => {
  return axios.post(`${APP_URL}/api/v1/mind-spark-questions`, payload, {
    headers: authHeaders(token),
  });
};

export const deleteMindSparkQuestionAPI = (token, questionId) => {
  return axios.delete(`${APP_URL}/api/v1/mind-spark-questions/${questionId}`, {
    headers: authHeaders(token),
  });
};
