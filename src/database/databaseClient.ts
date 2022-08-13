import { DatabaseConection } from '@/database';

export class DatabaseClient {
  constructor(public dbAdapter: DatabaseConection) { }
}