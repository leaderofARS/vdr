const axios = require('axios');
const { loadConfig } = require('./configManager');

async function makeRequest(method, endpoint, data = null) {
    const config = loadConfig();
    const apiUrl = config.apiUrl || 'https://api.sipheron.com';
    const apiKey = config.apiKey || process.env.SIPHERON_API_KEY;

    return axios({
        method,
        url: `${apiUrl}${endpoint}`,
        data,
        headers: {
            'x-api-key': apiKey,
            ...(data && { 'Content-Type': 'application/json' })
        }
    });
}

module.exports = { makeRequest };
