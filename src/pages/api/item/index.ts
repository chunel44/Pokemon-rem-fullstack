
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';

import { db } from '@/database';

import { IPokemon, Pokemon } from '@/models'

interface seedPokemon {
  apiId: string;
  name: string;
  imgUrl: string;
  item?: string;
  team: string;
}

type Data = | {
  message: string
} | IPokemon

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return addItemToPokemon(req, res);
    default:
      res.status(400).json({
        message: 'Bad request'
      })
  }
}



async function addItemToPokemon(req: NextApiRequest, res: NextApiResponse<Data>) {
  const session: any = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Debe de estar autenticado para hacer esto' });
  }
  // const { _id }: { _id: string } = session.user as any;
  const { data } = req.body;
  const pokemonId = data.pokemonId as string
  const item = data.item as string

  await db.connect();
  const poke = await Pokemon.findByIdAndUpdate(pokemonId, { item: item });
  await db.disconnect();
  if (!poke) {
    return res.status(400).json({ message: 'Error al agregar el item' });
  }
  poke.item = item;
  return res.json(poke)
}

