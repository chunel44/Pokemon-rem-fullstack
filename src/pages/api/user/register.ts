
import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '@/database';

import { User } from '@/models';
import { UserRepository } from '@/repository/userRepository';
import { jwt, validations } from '@/utilites';

type Data =
  | { message: string }
  | {
    token: string;
    user: {
      email: string;
      name: string;
      imgUrl?: string;
    }
  }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return registerUser(req, res)

    default:
      res.status(400).json({
        message: 'Bad request'
      })
  }
}

async function registerUser(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { email = '', password = '', name = '' } = req.body as { email: string, password: string, name: string };
  const userRepository = new UserRepository({ model: User });
  if (password.length < 6) {
    return res.status(400).json({
      message: 'La contraseña debe de ser de 6 caracteres'
    });
  }

  if (name.length < 2) {
    return res.status(400).json({
      message: 'El nombre debe de ser de 2 caracteres'
    });
  }

  if (!validations.isValidEmail(email)) {
    return res.status(400).json({
      message: 'El correo no tiene formato de correo'
    });
  }
  await db.connect();
  const user = await userRepository.findByEmail(email);
  if (user) {
    return res.status(400).json({
      message: 'Este correo ya está registrado'
    })
  }
  const newUser = new User({
    email: email.toLocaleLowerCase(),
    password: bcrypt.hashSync(password),
    name,
    imgUrl: ''
  });

  try {
    await userRepository.create(newUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Revisar logs del servidor'
    })
  }
  await db.disconnect();

  const { _id } = newUser;

  const token = jwt.signToken(_id, email);

  return res.status(200).json({
    token, //jwt
    user: {
      email,
      name,
    }
  })

}
