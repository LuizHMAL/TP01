import fs from 'fs/promises';
import { Aluno } from '../model/Aluno.js';
import path from 'path';

export type ContigResult = {
  blocks: Buffer[]; 
};

function alunoToBuffer(aluno: Aluno): Buffer {

  const json = JSON.stringify(aluno);
  const payload = Buffer.from(json, 'utf8');
  const header = Buffer.alloc(4);
  header.writeUInt32LE(payload.length, 0);
  return Buffer.concat([header, payload]); 
}

export async function writeContiguous(alunos: Aluno[], blockSize: number, allowSpread: boolean, outDir='output'): Promise<ContigResult> {
  await fs.mkdir(outDir, { recursive: true });
  const blocks: Buffer[] = [];

  let current = Buffer.alloc(blockSize, 0);
  let pos = 0; 

  for (const aluno of alunos) {
    const record = alunoToBuffer(aluno);
    let writeIndex = 0;
    if (!allowSpread) {

      if (record.length > blockSize) {
        throw new Error(`Registro com ${record.length} bytes maior que bloco (${blockSize}) — impossível sem espalhamento.`);
      }
      if (pos + record.length > blockSize) {
    
        blocks.push(current);
        current = Buffer.alloc(blockSize, 0);
        pos = 0;
      }
      record.copy(current, pos);
      pos += record.length;
    } else {
   
      while (writeIndex < record.length) {
        const remain = blockSize - pos;
        if (remain === 0) {
          blocks.push(current);
          current = Buffer.alloc(blockSize, 0);
          pos = 0;
        }
        const toWrite = Math.min(remain, record.length - writeIndex);
        record.copy(current, pos, writeIndex, writeIndex + toWrite);
        pos += toWrite;
        writeIndex += toWrite;
      }
    }
  }

  blocks.push(current);

  const filePath = path.join(outDir, 'alunos.dat');
  await fs.writeFile(filePath, Buffer.concat(blocks));
  return { blocks };
}
