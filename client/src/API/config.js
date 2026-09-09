const APP_URL = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? 'http://localhost:4004'
    : 'https://api.hticlab.org';

export default APP_URL;