import { CallbackError } from "mongoose";

export interface IWrite<T> {
  create(item: T): Promise<T>;
  update(filter: T, update: T): Promise<T | null>;
  delete(id: string, callback?: (error: CallbackError) => void): Promise<boolean>;
}