import { Request, Response } from 'express';
import db from '../../db';
import { initModel, Post } from '../../models/post';
import { verifyToken } from '../users/auth-utils';

initModel(db);

export default async (req: Request, res: Response) => {
  const token = req.header('x-token');
  const { title, body, authorId } = req.body;

  if (!token) {
    res.status(401); // Unauthorized
    res.json({
      result: 'Error',
      data: 'Auth Token required.'
    });
    return;
  }

  try {
    const { userId } = verifyToken(token);

    if (userId !== authorId)  {
      throw 'whatever';
    }
  } catch (err) {
    res.status(401); // Unauthorized
    res.json({
      result: 'Error',
      data: 'Auth Token invalid.'
    });
    return;
  }

  try {
    await Post.create({
      title,
      body,
      authorId
    });

    res.json({
      result: 'OK',
      data: {
        title,
        body,
        authorId
      }
    });
  } catch (err) {
    res.status(500);
    res.json({
      result: 'Error',
      data: `Could not write to DB: ${err}`
    });
  }
};
