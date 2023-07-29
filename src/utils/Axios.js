const axios = require('axios');

const api_url = process.env.REACT_APP_API_URL || "http://oracle01.stephenphyo.com:9001";
const api = axios.create({
    baseURL: api_url,
})

module.exports = api;