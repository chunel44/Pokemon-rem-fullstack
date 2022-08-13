import { Document } from "mongoose";

import { ITeam } from '.';

export interface IPokemon extends Document {
  apiId: string;
  name: string;
  imgUrl: string;
  item?: string;
  team: ITeam['_id'];
}