import mongoose, { CallbackError, Model } from 'mongoose';

import { IRead, IWrite } from '@/repository/interfaces';


export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {

  public model: Model<T>;

  constructor({ model }: { model: Model<T> }) {
    this.model = model;
  }

  async findOne(cond: any, { populate }: { populate?: string }) {
    return await this.model.findOne({ cond }).select('-__v');
  }


  async find({ populate }: { populate?: string }): Promise<T[]> {
    const p = new Promise<T[]>((resolve, reject) => {
      populate ?
        this.model.find({}, (err: CallbackError, result: T[]) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(<T[]>result);
          }
        }).populate(populate).select('-__v')
        : this.model.find({}, (err: CallbackError, result: T[]) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(<T[]>result);
          }
        }).select('-__v')
    });
    return p;
  }

  async create(item: T): Promise<T> {
    const data = this.model.create(item)
    return data;
  }

  async findById(id: string, { populate }: { populate?: string }): Promise<T | null> {
    const find = await this.model.findById(id).select('-__v');
    return find;
  }

  update(filter: T, update: T): Promise<T | null> {
    const p = new Promise<T>((resolve, reject) => {
      const options = {
        upsert: true
      };
      this.model.findOneAndUpdate(filter, update, options, (err, result) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(<T>result);
        }
      });
    });

    return p;
  }

  delete(id: string, callback?: ((error: mongoose.CallbackError) => void)): Promise<boolean> {
    const p = new Promise<boolean>((resolve, reject) => {
      this.model.remove({ _id: this.toObjectId(id) }, (err) => {
        if (callback) {
          callback(err);
        }
        if (err) {
          reject(err);
        }
        else {
          resolve(true);
        }
      });
    });
    return p;
  }



  private toObjectId(id: string) {
    return mongoose.Types.ObjectId.createFromHexString(id);
  }

}