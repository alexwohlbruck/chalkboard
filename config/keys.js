module.exports = {
    database: {
        url : process.env.DATABASE_URL
    },
    session: {
        secret: process.env.SESSION_SECRET
    },
    oauth: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackUrl: '/api/users/auth/google/callback'
    }
};