const http = require('http');
require('dotenv').config();
if (!process.env.AWS_ACCESS_KEY_ID && process.env.AWS_IVS_ACCESS_KEY) {
    process.env.AWS_ACCESS_KEY_ID = process.env.AWS_IVS_ACCESS_KEY;
}
if (!process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_IVS_SECRET_KEY) {
    process.env.AWS_SECRET_ACCESS_KEY = process.env.AWS_IVS_SECRET_KEY;
}
const app = require('./app');
const { initSocket } = require('./services/socketService');
const { initActivityTable } = require('./services/activityTrackingService');

const port = Number(process.env.PORT || 4004);
const server = http.createServer(app);

initSocket(server);

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please stop the process using this port.`);
    } else {
        console.error('Server error:', err);
    }
    process.exit(1);
});

server.listen(port, () => {
    console.log(`Server v1 listening on port ${port}`);
    initActivityTable().catch((error) => {
        console.error('Activity table initialization failed:', error.message);
    });
});

module.exports = server;
