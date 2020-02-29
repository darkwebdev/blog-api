import { Request, Response } from 'express';
import { compareSync } from 'bcryptjs';
import db from '../../db';
import { initModel, User } from '../../models/user';
import { signIn } from './auth-utils';

initModel(db);

export default async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(401);
    res.json({
      result: 'Error',
      data: 'Username and password required.'
    });
    return;
  }

  try {
    const user = await User.findOne({
      where: { username }
    });

    if (user && compareSync(password, user.password)) {
      res.json({
        result: 'OK',
        data: signIn(user.id)
      });
    } else {
      res.status(401);
      res.json({
        result: 'Error',
        data: `User ${username} or password is wrong.`
      });
    }
  } catch (err) {
    console.error(`Database error: ${err}`);
  }
};
