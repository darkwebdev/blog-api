import { Request, Response } from 'express';

const mockUserModel = {
  initModel: jest.fn(),
  User: {
    findOne: jest.fn().mockResolvedValue({})
  }
};
jest.doMock('../../../models/user', () => mockUserModel);
const mockSignin = jest.fn().mockResolvedValue('fake-token');
jest.doMock('../../users/auth-utils', () => ({ signIn: mockSignin }));
const mockCompare = jest.fn().mockResolvedValue(true);
jest.doMock('bcryptjs', () => ({ compareSync: mockCompare }));

import authUser from '../auth';

describe('POST /users/auth', () => {
  beforeEach(() => {
    mockCompare.mockReset();
    mockSignin.mockReset();
    mockUserModel.User.findOne.mockReset();
  });

  describe('given no username in req', () => {
    it('should return error', async () => {
      const req = mockReq({});
      const res = mockRes({});

      await authUser(req, res);

      expect(res.status).toBeCalledWith(401);
      expect(res.json).toBeCalledWith({
        result: 'Error',
        data: 'Username and password required.'
      });
    });
  });

  describe('by default', () => {
    it('should return token', async () => {
      const req = mockReq({ body: { username: 'user1', password: 'qwerty' } });
      const res = mockRes({});
      mockUserModel.User.findOne.mockResolvedValue({ id: '123', password: 'hash' });
      mockCompare.mockReturnValue(true);
      mockSignin.mockReturnValue('fake-token');

      await authUser(req, res);

      expect(res.json).toBeCalledWith({
        result: 'OK',
        data: 'fake-token'
      });
    });
  });
});

function mockReq({
  query = {},
  params = {},
  body = {},
  header = jest.fn()
}) {
  return <Partial<Request>>{ query, params, body, header } as Request;
}

function mockRes({
  status = jest.fn(),
  json = jest.fn()
}) {
  return <Partial<Response>>{ status, json } as Response;
}
