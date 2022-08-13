import mongoose from 'mongoose';

import { DatabaseConection } from '@/database';

export class MongoConnection implements DatabaseConection {
  private url: string;
  private mongoConnection = {
    isConnected: 0
  }

  constructor({ url }: { url: string }) {
    this.url = url;
  }


  async connect(): Promise<void> {
    if (this.mongoConnection.isConnected) {
      console.log('Ya estabamos conectados');
      return;
    }

    if (mongoose.connections.length > 0) {
      this.mongoConnection.isConnected = mongoose.connections[0].readyState;

      if (this.mongoConnection.isConnected === 1) {
        console.log('Usando conexión anterior');
        return;
      }

      await mongoose.disconnect();
    }

    await mongoose.connect(this.url);
    this.mongoConnection.isConnected = 1;
    console.log('Conectado a MongoDB:', this.url);
  }

  async disconnect(): Promise<void> {
    if (process.env.NODE_ENV === 'development') return;

    if (this.mongoConnection.isConnected === 0) return;

    await mongoose.disconnect();
    this.mongoConnection.isConnected = 0;
    console.log('Desconectado de MongoDB');
  }

}