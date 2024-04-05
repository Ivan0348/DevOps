const axios = require('axios');
const CircuitBreaker = require('opossum');
const makeJwtOriginCheck = require('./originCheck');

const timeout = 3000;

const circuitBreakerOptions = {
    timeout: timeout,
    errorThresholdPercentage: 50,
    resetTimeout: 30000,
};

const circuitBreaker = new CircuitBreaker(serviceCall, circuitBreakerOptions);

circuitBreaker.fallback(() => {
    /* eslint-disable no-undef */
    return Promise.resolve({status: 503, data: {error: "Service is unavailable"}});
    /* eslint-enable no-undef */
});

async function makeServiceRequest(location, req) {
    const url = location + req.url;

    console.log(`${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}: API is making request to ${url}`);
    try {
        return await circuitBreaker.fire({
            method: req.method,
            url: url,
            data: req.body,
            headers: {
                'authorization': req.headers.authorization,
                'gatewayOrigin': makeJwtOriginCheck(timeout),
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error(`Error while calling ${url}: `, error);
        if (error.response && error.response.status) {
            console.error(`Service responded with status: ${error.response.status} | reason: ${error.response.message}`);
        }
        return error;
    }
}

async function serviceCall(options) {
    try {
        return await axios(options);
    } catch (error) {
        if (error.response) {
            return error.response;
        }
        throw error;
    }
}

module.exports = {makeServiceRequest};
