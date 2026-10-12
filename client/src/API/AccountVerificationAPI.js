import axios from 'axios';
import APP_URL from './config';

export const requestAccountVerification = (data) =>
  axios.post(`${APP_URL}/api/v1/account-verification/request`, data);

export const verifyAccount = (data) =>
  axios.post(`${APP_URL}/api/v1/account-verification/verify`, data);
