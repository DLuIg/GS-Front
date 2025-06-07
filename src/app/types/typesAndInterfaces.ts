export interface CardData {
  id_MURAL: number;
  localizacao: string;
  mensagem: string;
  dateTime: string;
  nomeUsuario: string;
  id_usuario:number;
}

export type User = {
  id: number;
  nome: string;
};