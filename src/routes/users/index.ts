import { Request, Response } from 'express';
import { JsonResponse } from '../types';
import db from '../../db';
import initModel, { User } from '../../models/user';

initModel(db);

export default async (req: Request, res: Response) => {
  const users = await User.findAll();
  const jsonResponse: JsonResponse = {
    result: 'OK',
    data: users
  };

  res.json(jsonResponse);
};
