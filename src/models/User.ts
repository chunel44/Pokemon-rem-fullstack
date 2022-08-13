import mongoose, { Model, model, Schema } from 'mongoose';

import { IUser } from '@/models/types';


const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  imgUrl: { type: String },
}, {
  timestamps: true,
});

const User: Model<IUser> = mongoose.models.User || model('User', userSchema);

export default User;