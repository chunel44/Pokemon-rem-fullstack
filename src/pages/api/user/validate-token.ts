import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database';

import { User } from '@/models';
import { UserRepository } from '@/repository/userRepository';
import { jwt } from '@/utilites';

type Data =
  | { message: string }
  | {
    token: string;
    user: {
      email: string;
      name: string;
    }
  }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return checkJWT(req, res)

    default:
      res.status(400).json({
        message: 'Bad request'
      })
  }
}

async function checkJWT(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { token = '' } = req.cookies;

  const userRepository = new UserRepository({ model: User });
  let userId = '';

  try {
    userId = await jwt.isValidToken(token);

  } catch (error) {
    return res.status(401).json({
      message: 'Token de autorización no es válido'
    })
  }


  await db.connect();
  const user = await userRepository.findById(userId);
  await db.disconnect();

  if (!user) {
    return res.status(400).json({ message: 'No existe usuario con ese id' })
  }

  const { _id, email, name } = user;

  return res.status(200).json({
    token: jwt.signToken(_id, email),
    user: {
      email,
      name
    }
  })
}
