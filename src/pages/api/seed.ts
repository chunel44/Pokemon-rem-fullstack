import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'

import { db, seedDatabase } from '@/database';

import { Pokemon, Team, User } from '@/models';



type Data = {
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {


  await db.connect();

  delete mongoose.models.User;
  delete mongoose.models.Team;
  delete mongoose.models.Pokemon;

  await User.deleteMany();
  await User.insertMany(seedDatabase.seedData.users);

  await Team.deleteMany();
  await Team.insertMany(seedDatabase.seedData.teams);

  await Pokemon.deleteMany();
  await Pokemon.insertMany(seedDatabase.seedData.pokemons);

  await db.disconnect();


  res.status(200).json({ message: 'Proceso realizado correctamente' });
}