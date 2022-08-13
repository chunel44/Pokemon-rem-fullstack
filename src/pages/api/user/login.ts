import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '@/database';

import { User } from '@/models';
import { jwt } from '@/utilites';

import { UserRepository } from '../../../repository/userRepository';

type Data =
  | { message: string }
  | {
    token: string;
    user: {
      email: string;
      name: string;
      imgUrl: string;
    }
  }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  switch (req.method) {
    case 'POST':
      return loginUser(req, res);

    default:
      res.status(400).json({
        message: 'Bad request'
      })
  }
}

async function loginUser(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { email = '', password = '' } = req.body;
  console.log(req.body)
  const userRepository = new UserRepository({ model: User });

  await db.connect();
  const user = await userRepository.findByEmail(email);
  await db.disconnect();

  if (!user) {
    return res.status(400).json({ message: 'Correo o contraseña no válidos - EMAIL' })
  }

  if (!bcrypt.compareSync(password, user.password!)) {
    return res.status(400).json({ message: 'Correo o contraseña no válidos - Password' })
  }

  const { name, _id, imgUrl } = user;

  const token = jwt.signToken(_id, email);

  return res.status(200).json({
    token, //jwt
    user: {
      email, name, imgUrl
    }
  })
}
