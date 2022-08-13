import mongoose, { Model, model, Schema } from 'mongoose';

import { ITeam } from '@/models/types';


const teamSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  pokemons: [{ type: Schema.Types.ObjectId, ref: 'Pokemon' }]
}, {
  timestamps: true,
});

const Team: Model<ITeam> = mongoose.models.Team || model('Team', teamSchema);

export default Team;