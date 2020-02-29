import { Request, Response } from 'express';

const mockUserModel = {
  initModel: jest.fn(),
  User: {
    findOrCreate: jest.fn().mockResolvedValue([{}, false])
  }
};
jest.doMock('../../../models/user', () => mockUserModel);
const mockSignin = jest.fn();
jest.doMock('../../users/auth-utils', () => ({ signIn: mockSignin }));
jest.doMock('bcryptjs');

import addUser from '../add';

describe('POST /users', () => {
  beforeEach(() => {
    mockSignin.mockReset();
    mockUserModel.User.findOrCreate.mockReset();
  });

  describe('given no username/password in req', () => {
    it('should return error', async () => {
      const req = mockReq({});
      const res = mockRes({});

      await addUser(req, res);

      expect(res.status).toBeCalledWith(401);
    });
  });

  describe('given user already exists', () => {
    it('should return error', async () => {
      const req = mockReq({ body: { username: 'user1' } });
      const res = mockRes({});
      mockUserModel.User.findOrCreate.mockResolvedValue([{}, false]);

      await addUser(req, res);

      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledWith({
        result: 'Error',
        data: 'User user1 already exists.'
      });
    });
  });

  describe('given db error', () => {
    it('should return error', async () => {
      const req = mockReq({ body: { username: 'user1', password: 'qwerty' } });
      const res = mockRes({});
      mockUserModel.User.findOrCreate.mockResolvedValue([undefined, false]);

      await addUser(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.json).toBeCalledWith({
        result: 'Error',
        data: 'Database Error: Unknown error.'
      });
    });
  });

  describe('by default', () => {
    it('should return token', async () => {
      mockSignin.mockReturnValue('fake-token');
      mockUserModel.User.findOrCreate.mockResolvedValue([{ id: '123' }, true]);
      const req = mockReq({});
      const res = mockRes({});

      await addUser(req, res);

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
