export interface UsuarioInterface {
  matricula: number;
  nome: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
}
