// src/api/volumeUpload.js
import axios from 'axios';
import APP_URL from './config';

async function VolumeUploadAPI(token, data) {
  const file = data.get('file');
  const headers = { Authorization: `Bearer ${token}` };
  const metadata = Object.fromEntries([...data.entries()].filter(([key]) => key !== 'file'));
  const { data: upload } = await axios.post(`${APP_URL}/api/v1/sv-upload/prepare`, {
    ...metadata, filename: file.name, size: file.size,
  }, { headers });
  await axios.put(upload.uploadUrl, file, {
    headers: { 'Content-Type': 'application/octet-stream', 'If-None-Match': '*' },
    withCredentials: false,
  });
  return axios.post(`${APP_URL}/api/v1/sv-upload/complete`, { uploadToken: upload.uploadToken }, { headers });
}

export default VolumeUploadAPI;
