require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const validateEnv = require('./config/validateEnv');

const startServer = async () => {
    validateEnv();

    try {
        await connectDB();
    } catch (error) {
        error.startupStage = 'database';
        throw error;
    }

    const app = require('./app');
    const port = process.env.PORT || 5000;

    return new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log('Available routes:');
            console.log('- GET /api/stats/complaints');
            console.log('- GET /api/stats/users');
            console.log('- GET /api/auth/stats');
            console.log('- GET /api/complaints/stats');
            resolve(server);
        });

        server.once('error', reject);
    });
};

const registerShutdownHandlers = (server) => {
    let shuttingDown = false;

    const shutdown = (signal) => {
        if (shuttingDown) return;
        shuttingDown = true;
        console.log(`${signal} received; closing server`);

        server.close((serverError) => {
            mongoose.connection.close()
                .then(() => {
                    if (serverError) {
                        console.error('HTTP server shutdown failed');
                        process.exitCode = 1;
                    }
                })
                .catch(() => {
                    console.error('MongoDB shutdown failed');
                    process.exitCode = 1;
                });
        });
    };

    process.once('SIGINT', () => shutdown('SIGINT'));
    process.once('SIGTERM', () => shutdown('SIGTERM'));
};

const reportStartupFailure = async (error) => {
    if (error.code === 'MISSING_REQUIRED_ENV') {
        console.error(`Server startup failed: ${error.message}`);
    } else if (error.startupStage === 'database') {
        console.error(`MongoDB initial connection failed (${error.name}). Check Atlas reachability, credentials, and MONGO_URI.`);
    } else {
        console.error(`Server startup failed (${error.code || error.name || 'unknown error'}).`);
    }

    try {
        await mongoose.disconnect();
    } catch (disconnectError) {
        console.error('Could not close MongoDB after startup failure');
    }
    process.exitCode = 1;
};

if (require.main === module) {
    startServer()
        .then(registerShutdownHandlers)
        .catch(reportStartupFailure);
}

module.exports = { startServer };