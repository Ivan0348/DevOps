const {makeServiceRequest} = require('./circuitBreaker');

async function serviceHandler(location, req, res, next) {
    try {
        const response = await makeServiceRequest(location, req);
        res.status(response.status).json(response.data);
    } catch (error) {
        next(error);
    }
}

async function loginService(req, res, next) {
    await serviceHandler(process.env.LOGINLOCATION, req, res, next);
}

async function registerService(req, res, next) {
    await serviceHandler(process.env.REGISTRATIONLOCATION, req, res, next);
}


module.exports = {loginService, registerService}