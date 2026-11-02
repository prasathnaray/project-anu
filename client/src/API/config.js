const APP_URL = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? 'http://localhost:4004'
    : 'https://api-v1.anuxr.com';

export default APP_URL;
//working on the api.js file to handle token refresh and retry the original request if it fails due to an expired token.