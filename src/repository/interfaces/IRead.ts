
export interface IRead<T> {
  find({ populate }: { populate?: string }): Promise<T[]>;
  findOne(cond: any, { populate }: { populate?: string }): Promise<T | null>;
  findById(id: string, { populate }: { populate?: string }): Promise<T | null>;
}