import { Document } from "mongoose";

import { IPokemon, IUser } from ".";

export interface ITeam extends Document {
  name: string;
  userId: IUser['_id'];
  pokemons: IPokemon[];
}