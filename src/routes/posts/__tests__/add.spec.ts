import { Request, Response } from 'express';

const mockPostModel = {
  initModel: jest.fn(),
  Post: {
    create: jest.fn().mockResolvedValue({})
  }
};
jest.doMock('../../../models/post', () => mockPostModel);
const mockVerify = jest.fn();
jest.doMock('../../users/auth-utils', () => ({ verifyToken: mockVerify }));

import addPost from '../add';

describe('POST /posts', () => {
  beforeEach(() => {
    mockVerify.mockReset();
    mockPostModel.Post.create.mockReset();
  });

  describe('given no token', () => {
    it('should return error', async () => {
      const req = mockReq({});
      const res = mockRes({});

      await addPost(req, res);

      expect(res.status).toBeCalledWith(401);
      expect(res.json).toBeCalledWith({
        result: 'Error',
        data: 'Auth Token required.'
      });
    });
  });

  describe('given invalid token', () => {
    it('should return error', async () => {
      const req = mockReq({ header: jest.fn().mockReturnValue('fake-token') });
      const res = mockRes({});

      await addPost(req, res);

      expect(res.status).toBeCalledWith(401);
      expect(res.json).toBeCalledWith({
        result: 'Error',
        data: 'Auth Token invalid.'
      });
    });
  });

  describe('given wrong token', () => {
    it('should return error', async () => {
      mockVerify.mockReturnValue({ userId: '123' });
      const req = mockReq({
        body: { authorId: '456' },
        header: jest.fn().mockReturnValue('fake-token')
      });
      const res = mockRes({});

      await addPost(req, res);

      expect(res.status).toBeCalledWith(401);
      expect(res.json).toBeCalledWith({
        result: 'Error',
        data: 'Auth Token invalid.'
      });
    });
  });

  describe('given db error', () => {
    it('should return error', async () => {
      mockVerify.mockReturnValue({ userId: '123' });
      mockPostModel.Post.create.mockRejectedValue('error');
      const req = mockReq({
        body: { authorId: '123' },
        header: jest.fn().mockReturnValue('fake-token')
      });
      const res = mockRes({});

      await addPost(req, res);

      expect(res.status).toBeCalledWith(500);
      expect(res.json).toBeCalledWith({
        result: 'Error',
        data: 'Could not write to DB: error'
      });
    });
  });

  describe('by default', () => {
    it('should return result', async () => {
      mockVerify.mockReturnValue({ userId: '123' });
      const mockBody = { title: 'title', body: 'body', authorId: '123' };
      const req = mockReq({
        body: mockBody,
        header: jest.fn().mockReturnValue('fake-token')
      });
      const res = mockRes({});

      await addPost(req, res);

      expect(res.json).toBeCalledWith({
        result: 'OK',
        data: mockBody
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
