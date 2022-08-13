import mongoose, { Model, model, Schema } from 'mongoose';

import { IPokemon } from '@/models/types';


const pokemonSchema: Schema = new Schema({
  apiId: { type: String, required: true },
  name: { type: String, required: true },
  imgUrl: { type: String },
  item: { type: String },
  team: { type: Schema.Types.ObjectId, required: true, ref: 'Team' },
}, {
  timestamps: true,
});

const Pokemon: Model<IPokemon> = mongoose.models.Pokemon || model('Pokemon', pokemonSchema);

export default Pokemon;