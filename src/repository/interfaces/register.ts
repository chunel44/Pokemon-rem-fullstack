export interface IRegister {
  login(email: string, password: string): Promise<void>,
  register(email: string, name: string, password: string): Promise<void>,
}