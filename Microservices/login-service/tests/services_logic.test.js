const {RefreshTokens} = require('../dbModels/dbSchemas'); // Import your User model
const {config} = require('../config');
const jwt = require('jsonwebtoken');


const {token} = require('../services_logic');

describe('token function', () => {
    const req = {body: {}};
    const res = {
        sendStatus: jest.fn(),
        json: jest.fn(),
        status: jest.fn(() => res),
        send: jest.fn()
    };
    const mockRefreshToken = 'mockRefreshToken';
    const mockUser = {id: 'mockUserId', email: "mockUserEmail", role: "mockUserRole", username: "mockUser"};

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 401 if refreshToken is null', async () => {
        await token(req, res);
        expect(res.sendStatus).toHaveBeenCalledWith(401);
    });

    it('should return 401 if refreshToken does not exist in database', async () => {
        req.body.token = mockRefreshToken;
        /* eslint-disable no-undef */
        RefreshTokens.findOne = jest.fn(() => Promise.resolve(null));
        /* eslint-enable no-undef */
        await token(req, res);
        expect(RefreshTokens.findOne).toHaveBeenCalledWith({refreshToken: mockRefreshToken});
        expect(res.sendStatus).toHaveBeenCalledWith(401);
    });

    it('should return 401 if refreshToken verification fails', async () => {
        req.body.token = mockRefreshToken;
        const mockError = new Error('Verification failed');
        /* eslint-disable no-undef */
        RefreshTokens.findOne = jest.fn(() => Promise.resolve({refreshToken: mockRefreshToken}));
        /* eslint-enable no-undef */
        jest.spyOn(jwt, 'verify').mockImplementationOnce((token, secret, callback) => callback(mockError));
        await token(req, res);
        expect(jwt.verify).toHaveBeenCalledWith(mockRefreshToken, config.REFRESH_TOKEN_SECRET, expect.any(Function));
        expect(res.sendStatus).toHaveBeenCalledWith(401);
    });

    it('should return accessToken if refreshToken verification succeeds', async () => {
        req.body.token = mockRefreshToken;
        /* eslint-disable no-undef */
        RefreshTokens.findOne = jest.fn(() => Promise.resolve({refreshToken: mockRefreshToken}));
        /* eslint-enable no-undef */
        jest.spyOn(jwt, 'verify').mockImplementationOnce((token, secret, callback) => callback(null, mockUser));
        jest.spyOn(jwt, 'sign').mockReturnValueOnce('mockAccessToken');
        await token(req, res);
        expect(jwt.verify).toHaveBeenCalledWith(mockRefreshToken, config.REFRESH_TOKEN_SECRET, expect.any(Function));
        expect(jwt.sign).toHaveBeenCalledWith(expect.objectContaining({
            id: undefined,
            email: mockUser.email,
            role: mockUser.role,
            username: mockUser.username
        }), config.ACCESS_TOKEN_SECRET, {expiresIn: config.ACCESS_TOKEN_EXPIRES});
        expect(res.json).toHaveBeenCalledWith({accessToken: 'mockAccessToken'});
    });

    it('should handle errors thrown during execution', async () => {
        req.body.token = mockRefreshToken;
        const mockError = new Error('Test error');
        RefreshTokens.findOne = jest.fn(() => {
            throw mockError;
        });
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        });
        await token(req, res);
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error occurred while verifying refresh token:", mockError);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Internal Server Error");
    });
});
