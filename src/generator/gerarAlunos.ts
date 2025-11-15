import { Aluno } from '../model/Aluno.js';

const firstNames = ["João", "Maria", "Pedro", "Ana", "Lucas", "Mariana", "Carlos", "Beatriz", "Rafael", "Julia"];
const lastNames = ["Silva", "Souza", "Oliveira", "Pereira", "Costa", "Almeida", "Gomes", "Rocha", "Fernandes", "Barbosa"];
const cursos = ["Engenharia", "Biologia", "Ciência da Computação", "Medicina", "Economia", "Direito", "Arquitetura"];

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number, dec = 2) => parseFloat((Math.random() * (max - min) + min).toFixed(dec));
const randomCPF = () => Array.from({length:11}, ()=>Math.floor(Math.random()*10)).join('');
const randomEmail = (name: string) => `${name.toLowerCase().replace(/\s+/g,'')}${rand(1,999)}@exemplo.com`;

export function gerarAlunos(quantidade: number, startMatricula = 100000000): Aluno[] {
  const out: Aluno[] = [];
  for (let i = 0; i < quantidade; i++) {
    const nome = `${firstNames[rand(0, firstNames.length-1)]} ${lastNames[rand(0, lastNames.length-1)]}`;
    const aluno: Aluno = {
      id: `A${Date.now().toString().slice(-6)}${i}`,
      nome,
      idade: rand(17, 60),
      matricula: startMatricula + i,
      email: randomEmail(nome),
      cpf: randomCPF(),
      curso: cursos[rand(0, cursos.length-1)],
      filiacaoMae: `${firstNames[rand(0,firstNames.length-1)]} ${lastNames[rand(0,lastNames.length-1)]}`,
      filiacaoPai: `${firstNames[rand(0,firstNames.length-1)]} ${lastNames[rand(0,lastNames.length-1)]}`,
      anoIngresso: rand(2015, 2024),
      ca: randFloat(0, 4, 2)
    };
    out.push(aluno);
  }
  return out;
}
