import { Request, Response } from 'express';

const fakePosts = [
  { title: 'title1', body: 'body1' },
  { title: 'title2', body: 'body2' }
];

const mockPostModel = {
  initModel: jest.fn(),
  Post: {
    findAll: jest.fn().mockReturnValue(fakePosts),
    findOne: jest.fn().mockReturnValue(fakePosts[0])
  }
};
jest.doMock('../../../models/post', () => mockPostModel);

import posts from '../get';

describe('GET /posts', () => {
  it('should return all posts', async () => {
    const req: Partial<Request> = {
      query: {},
      params: {}
    };
    const res: Partial<Response> = {
      json: jest.fn()
    };

    await posts(req as Request, res as Response);

    expect(res.json).toBeCalledWith({
      result: 'OK',
      data: fakePosts
    });
  });

  describe('?limit=1', () => {
    beforeEach(() => {
      mockPostModel.Post.findAll.mockReturnValue([fakePosts[0]]);
    });
    it('should return one post', async () => {
      const req: Partial<Request> = {
        query: { limit: 1 },
        params: {}
      };
      const res: Partial<Response> = {
        json: jest.fn()
      };

      await posts(req as Request, res as Response);

      expect(res.json).toBeCalledWith({
        result: 'OK',
        data: [fakePosts[0]]
      });
    });
  });

  describe('/1', () => {
    it('should return one post', async () => {
      const req: Partial<Request> = {
        query: {},
        params: { id: '1' }
      };
      const res: Partial<Response> = {
        json: jest.fn()
      };

      await posts(req as Request, res as Response);

      expect(res.json).toBeCalledWith({
        result: 'OK',
        data: fakePosts[0]
      });
    });
  });
});
