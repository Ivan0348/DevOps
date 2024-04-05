const jwt = require('jsonwebtoken');
const checkOrigin = require('../middleware/checkOrigin.js');

jest.mock('jsonwebtoken');

describe('checkOrigin', () => {
    it('should return 401 if origin header is missing', () => {
        const req = {headers: {}};
        const res = {status: jest.fn().mockReturnThis(), json: jest.fn()};
        const next = jest.fn();

        checkOrigin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({error: 'Unauthorized'});
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', () => {
        const req = {headers: {gatewayorigin: 'invalid-token'}};
        const res = {status: jest.fn().mockReturnThis(), json: jest.fn()};
        const next = jest.fn();

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token'));
        });

        checkOrigin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({error: 'Invalid token'});
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if origin is invalid', () => {
        const req = {headers: {gatewayorigin: 'valid-token'}};
        const res = {status: jest.fn().mockReturnThis(), json: jest.fn()};
        const next = jest.fn();

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, {gatewayLocation: 'invalid-location'});
        });

        checkOrigin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({error: 'Invalid origin'});
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next if origin is valid', () => {
        const req = {headers: {gatewayorigin: 'valid-token'}};
        const res = {status: jest.fn().mockReturnThis(), json: jest.fn()};
        const next = jest.fn();

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, {gatewayLocation: process.env.GATEWAYLOCATION});
        });

        checkOrigin(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });
});
