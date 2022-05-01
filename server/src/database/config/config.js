module.exports = {
    port: process.env.PORT || 8081,
    db: {
        database: process.env.DB_NAME || 'issuetracker',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'admin',
        options: {
            dialect: process.env.DIALECT || 'mysql',
            host: process.env.HOST || 'localhost'
        }
    },
    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'sdgfuhdsbfjhsdbf'
    }
}