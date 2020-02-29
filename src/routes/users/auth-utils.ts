import { sign, verify } from 'jsonwebtoken';

const secret = 'secret'; // todo: store secret ouside of app

export const signIn = (userId: string) => sign({ userId }, secret);

type TokenPayload = {
  userId: string;
};

export const verifyToken = (token: string) => verify(token, secret) as TokenPayload;
