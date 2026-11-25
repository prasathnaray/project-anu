// src/api/volumeUpload.js
import axios from 'axios';
import APP_URL from './config';

const uploadError = (stage, error) => {
  const responseMessage = error.response?.data?.message || error.response?.data?.error;
  const detail = typeof responseMessage === 'string' && !responseMessage.trim().startsWith('<')
    ? responseMessage
    : `HTTP ${error.response?.status || 'network error'}`;
  return new Error(`${stage}: ${detail}`);
};

async function VolumeUploadAPI(token, data) {
  const file = data.get('file');
  const headers = { Authorization: `Bearer ${token}` };
  const metadata = Object.fromEntries([...data.entries()].filter(([key]) => key !== 'file'));
  let upload;
  try {
    ({ data: upload } = await axios.post(`${APP_URL}/api/v1/sv-upload/prepare`, {
      ...metadata, filename: file.name, size: file.size,
    }, { headers }));
  } catch (error) {
    throw uploadError('Preparing upload failed', error);
  }
  try {
    await axios.put(upload.uploadUrl, file, {
      headers: { 'Content-Type': 'application/octet-stream', 'If-None-Match': '*' },
      withCredentials: false,
    });
  } catch (error) {
    throw uploadError('Sending file failed', error);
  }
  try {
    return await axios.post(`${APP_URL}/api/v1/sv-upload/complete`, { uploadToken: upload.uploadToken }, { headers });
  } catch (error) {
    throw uploadError('Finalizing upload failed', error);
  }
}

export default VolumeUploadAPI;
