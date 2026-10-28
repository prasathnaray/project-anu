const http = require('http');
require('dotenv').config();
const app = require('./app');
const { initSocket } = require('./services/socketService');
const { initActivityTable } = require('./services/activityTrackingService');

const port = Number(process.env.PORT || 4004);
const server = http.createServer(app);

initSocket(server);

server.listen(port, (err) => {
    if (err) {
        console.error(err);
        process.exitCode = 1;
        return;
    }

    console.log(`Server v1 listening on port ${port}`);
    initActivityTable().catch((error) => {
        console.error('Activity table initialization failed:', error.message);
    });
});

module.exports = server;
