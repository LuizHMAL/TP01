import fs from 'fs/promises';
import { Aluno } from '../model/Aluno.js';
import path from 'path';

export type FragmentedMeta = {
  table: Record<string, { blocks: number[]; size: number }>;
  freeBlocks: number[]; 
};

export async function writeFragmented(alunos: Aluno[], blockSize: number, outDir = 'output'): Promise<{ blocks: Buffer[]; meta: FragmentedMeta }> {
  await fs.mkdir(outDir, { recursive: true });
  const blocks: Buffer[] = [];
  const meta: FragmentedMeta = { table: {}, freeBlocks: [] };

  for (const aluno of alunos) {
    const payload = Buffer.from(JSON.stringify(aluno), 'utf8');
    const needed = Math.ceil(payload.length / blockSize);
    const usedBlocks: number[] = [];
   
    for (let i = 0; i < needed; i++) {
      const blockIdx = blocks.length;
      const start = i * blockSize;
      const chunk = payload.slice(start, start + blockSize);
      const block = Buffer.alloc(blockSize, 0);
      chunk.copy(block, 0);
      blocks.push(block);
      usedBlocks.push(blockIdx);
    }
    meta.table[aluno.id] = { blocks: usedBlocks, size: payload.length };
  }


  const filePath = path.join(outDir, 'alunos.dat');
  await fs.writeFile(filePath, Buffer.concat(blocks));

  await fs.writeFile(path.join(outDir, 'alunos_fragmented.meta.json'), JSON.stringify(meta, null, 2));
  return { blocks, meta };
}
