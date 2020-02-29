import { Request, Response } from 'express';
import { hashSync } from 'bcryptjs';
import db from '../../db';
import { initModel, User } from '../../models/user';
import { signIn } from './auth-utils';

initModel(db);

export default async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    // todo: better validation
    res.status(401);
    return;
  }

  try {
    const hash = hashSync(password, 10);
    const [user, created] = await User.findOrCreate({
      where: { username },
      defaults: { password: hash }
    });
    if (created) {
      const token = signIn(user.id);
      res.json({
        result: 'OK',
        data: token
      });
    } else if (user) {
      res.status(400);
      res.json({
        result: 'Error',
        data: `User ${username} already exists.`
      });
    } else {
      throw 'Unknown error.';
    }
  } catch (err) {
    res.status(500);
    res.json({
      result: 'Error',
      data: `Database Error: ${err}`
    });
  }
};
