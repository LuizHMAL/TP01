export interface Aluno {
  id: string;          
  nome: string;       
  idade: number;
  matricula: number;   
  email: string;
  cpf: string;        
  curso?: string;      
  filiacaoMae?: string;
  filiacaoPai?: string;
  anoIngresso?: number;
  ca?: number;         
}
