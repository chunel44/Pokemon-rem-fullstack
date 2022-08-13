export interface DatabaseConection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}