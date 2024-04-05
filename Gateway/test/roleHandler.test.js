const jwt = require('jsonwebtoken');
const {roleIsOwner} = require('../middleware/rolesHandler');

describe('roleIsOwner', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {
                authorization: 'Bearer <valid_token>'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should call next() if the role is owner', () => {
        const decoded = {
            role: 'owner'
        };
        jwt.verify = jest.fn().mockImplementation((token, secret, callback) => {
            callback(null, decoded);
        });

        roleIsOwner(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('<valid_token>', process.env.ACCESS_TOKEN_SECRET, expect.any(Function));
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    test('should return 401 error if the role is not owner', () => {
        const decoded = {
            role: 'user'
        };
        jwt.verify = jest.fn().mockImplementation((token, secret, callback) => {
            callback(null, decoded);
        });

        roleIsOwner(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('<valid_token>', process.env.ACCESS_TOKEN_SECRET, expect.any(Function));
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({error: 'your role is not authorized to access this resource'});
    });

    test('should return 401 error if the token is invalid', () => {
        jwt.verify = jest.fn().mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token'));
        });

        roleIsOwner(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('<valid_token>', process.env.ACCESS_TOKEN_SECRET, expect.any(Function));
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({error: 'Invalid token'});
    });

    test('should return 401 error if the token is missing', () => {
        req.headers.authorization = undefined;

        roleIsOwner(req, res, next);

        expect(jwt.verify).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({error: 'Unauthorized'});
    });
});
