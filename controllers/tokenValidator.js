const pool = require('../config/db'); // Adjust the path as necessary

async function isTokenValid(token) {
    try {
        const [tokens] = await pool.query('SELECT * FROM tokens WHERE token = ?', [token]);
        if (tokens.length === 0) {
            return false;
        }
        const tokenData = tokens[0];
        const now = new Date();
        const expirationDate = new Date(tokenData.expires_at);
        return now <= expirationDate;
    } catch (error) {
        console.error('Error verifying token:', error.message);
        return false;
    }
}

module.exports = isTokenValid;
