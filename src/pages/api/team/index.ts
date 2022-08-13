/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';

import { db } from '@/database';

import { ITeam, Pokemon, Team } from '@/models'

type Data = | {
  message: string
} | ITeam[] | ITeam

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getTeams(req, res);

    case 'POST':
      return createTeam(req, res);

    default:
      res.status(400).json({
        message: 'Bad request'
      })
  }
}

async function getTeams(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session: any = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Debe de estar autenticado para hacer esto' });
  }
  const { _id }: { _id: string } = session.user as any;

  await db.connect();
  let teams = await Team.find({ userId: _id }).populate('pokemons').select('-__v');
  if (!teams) {
    return res.status(400).json({
      message: 'No se encontro ningun Equipo'
    })
  }
  teams.map(async (team) => {
    const pokemons = await Pokemon.find({ team: team._id });
    if (pokemons) {
      team.pokemons = pokemons;
      return await team.save();
    }
  })

  await db.disconnect();

  return res.json(teams);

}


async function createTeam(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session: any = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Debe de estar autenticado para hacer esto' });
  }
  const { _id }: { _id: string } = session.user as any;

  const { data } = req.body;

  const nameTeam = data.nameTeam as string;

  await db.connect();
  let team = await Team.findOne({ name: nameTeam, userId: _id });
  if (team) {
    return res.status(400).json({ message: 'El equipo ya existe' })
  }
  const newTeam = new Team({
    name: nameTeam,
    userId: _id,
    pokemons: [],
  });
  const nTeam = await newTeam.save();
  await db.disconnect();
  return res.json(nTeam);

}