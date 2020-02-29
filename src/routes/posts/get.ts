import { Request, Response } from 'express';
import { JsonResponse } from '../types';
import db from '../../db';
import { initModel, Post } from '../../models/post';
import { DEFAULT_LIMIT } from '../../config';

initModel(db);

export default async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || DEFAULT_LIMIT;
  const { id } = req.params;
  const data = id === undefined
    ? await Post.findAll({ limit })
    : await Post.findOne({ where: { id } });

  const jsonResponse: JsonResponse = {
    result: 'OK',
    data
  };

  res.json(jsonResponse);
};
