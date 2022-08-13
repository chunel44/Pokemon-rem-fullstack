
import { BaseRepository } from './base/baseRepository';
import { IUser } from '../models/types/user.types';


export class UserRepository extends BaseRepository<IUser>{

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.model.findOne({ email: email }).select('-__v');
    return user;
  }
}