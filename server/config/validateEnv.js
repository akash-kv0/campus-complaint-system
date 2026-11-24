const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET', 'FRONTEND_URL'];

const validateEnv = () => {
    const missing = REQUIRED_ENV.filter(
        name => !process.env[name]?.trim()
    );

    if (missing.length > 0) {
        const error = new Error(
            `Missing required environment variables: ${missing.join(', ')}`
        );
        error.code = 'MISSING_REQUIRED_ENV';
        throw error;
    }
};

module.exports = validateEnv;