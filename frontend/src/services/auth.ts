import { post } from './api';

export interface Usuario {
  matricula: number;
  nome: string;
  email: string;
  role: string;
}

export async function login(email: string, senha: string): Promise<Usuario> {
  return post('/usuarios/login', { email, senha });
}
