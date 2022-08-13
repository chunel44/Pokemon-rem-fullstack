
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';

import { db } from '@/database';

import { SmallPokemon } from '@/interfaces';
import { IPokemon, Pokemon, Team } from '@/models'

interface seedPokemon {
  apiId: string;
  name: string;
  imgUrl: string;
  item?: string;
  team: string;
}

type Data = | {
  message: string
} | IPokemon[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getPokemonsByTeam(req, res);
    case 'POST':
      return createPokemonByTeam(req, res);
    default:
      res.status(400).json({
        message: 'Bad request'
      })
  }
}

async function getPokemonsByTeam(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session: any = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Debe de estar autenticado para hacer esto' });
  }
  const { teamName }: { teamName: string } = req.body;
  const { _id }: { _id: string } = session.user as any;

  await db.connect();
  const team = await Team.findOne({ userId: _id, name: teamName }).populate('pokemons').select('_id');
  await db.disconnect();
  if (!team) {
    return res.status(404).json({ message: 'No existe el equipo' });
  }
  const pokemons = await Pokemon.find({ team: team._id });

  return res.json(pokemons);

}

async function createPokemonByTeam(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session: any = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Debe de estar autenticado para hacer esto' });
  }
  const { data } = req.body;
  const teamName = data.teamName;
  const pokemons = data.pokemons as SmallPokemon[];
  const { _id }: { _id: string } = session.user as any;
  await db.connect();
  const team = await Team.findOne({ userId: _id, name: teamName }).select('_id');
  if (!team) {
    return res.status(404).json({ message: 'Equipo no encontrado' });
  }
  const teamId = team._id.toString();
  const newPokemons: seedPokemon[] = pokemons.map(poke => ({
    apiId: `${poke.id}`,
    name: poke.name,
    imgUrl: poke.img,
    item: '',
    team: teamId,
  }))
  const poke = await Pokemon.insertMany(newPokemons);
  await db.disconnect();
  return res.json(poke)
}

