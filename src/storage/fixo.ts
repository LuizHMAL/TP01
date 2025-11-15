import fs from 'fs/promises';
import { Aluno } from '../model/Aluno.js';
import path from 'path';

export type FixedResult = {
  blocks: Buffer[]; 
};

function serializeAlunoFixed(aluno: Aluno): string {
 
  const nome = (aluno.nome || '').slice(0,50);
  const curso = (aluno.curso || '').slice(0,30);
  const mae = (aluno.filiacaoMae || '').slice(0,30);
  const pai = (aluno.filiacaoPai || '').slice(0,30);
  const cpf = (aluno.cpf || '').slice(0,11);

  const parts = [
    aluno.matricula.toString().padStart(9,'0'),
    nome,
    cpf,
    curso,
    mae,
    pai,
    (aluno.anoIngresso ?? 0).toString().padStart(4,'0'),
    (aluno.ca ?? 0).toFixed(2)
  ];
  return parts.join('|');
}

export async function writeFixed(alunos: Aluno[], blockSize: number, outDir = 'output'): Promise<FixedResult> {
  await fs.mkdir(outDir, { recursive: true });
  const blocks: Buffer[] = [];

  for (const a of alunos) {
    const s = serializeAlunoFixed(a);
    const bytes = Buffer.from(s, 'utf8');
    if (bytes.length > blockSize) {
      throw new Error(`Registro maior que bloco (${bytes.length} > ${blockSize}). Aumente o bloco ou use variável.`);
    }
    const block = Buffer.alloc(blockSize, '#'); 
    bytes.copy(block, 0);
    blocks.push(block);
  }

  const filePath = path.join(outDir, 'alunos.dat');
 
  const buf = Buffer.concat(blocks);
  await fs.writeFile(filePath, buf);
  return { blocks };
}
