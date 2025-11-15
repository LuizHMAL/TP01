import { gerarAlunos } from './generator/gerarAlunos';
import { writeFixed } from './storage/fixo';
import { writeContiguous } from './storage/variavelContiguo';
import { writeFragmented } from './storage/variavelEspalhado';
import { gerarMapaEBaixarRelatorio } from './stats/estatisticas';
import fs from 'fs/promises';

async function main() {
  const args = process.argv.slice(2);
  const numAlunos = Number(args[0] ?? 100);
  const blockSize = Number(args[1] ?? 512);
  const modo = (args[2] ?? 'contig');
  const spread = (args[3] ?? 'no'); 

  console.log(`Gerando ${numAlunos} alunos — bloco ${blockSize} bytes — modo: ${modo} (spread=${spread})`);

  const alunos = gerarAlunos(numAlunos);


  try { await fs.rm('output', { recursive: true, force: true }); } catch {}

  if (modo === 'fixo') {
    const { blocks } = await writeFixed(alunos, blockSize, 'output');
    await gerarMapaEBaixarRelatorio(blocks, 'output', 'Registros de Tamanho Fixo');
    console.log('Concluído: output/alunos.dat, mapa_blocos.txt, relatorio.txt');
  } else if (modo === 'contig') {
    const allowSpread = spread.toLowerCase() === 'yes';
    const { blocks } = await writeContiguous(alunos, blockSize, allowSpread, 'output');
    await gerarMapaEBaixarRelatorio(blocks, 'output', `Registros Variáveis Contíguos (spread=${allowSpread})`);
    console.log('Concluído: output/alunos.dat, mapa_blocos.txt, relatorio.txt');
  } else if (modo === 'frag') {
    const { blocks } = await writeFragmented(alunos, blockSize, 'output');
    await gerarMapaEBaixarRelatorio(blocks, 'output', 'Registros Variáveis Espalhados (fragmentados)');
    console.log('Concluído: output/alunos.dat, output/alunos_fragmented.meta.json, mapa_blocos.txt, relatorio.txt');
  } else {
    console.error('Modo inválido. Use fixo | contig | frag');
  }
}

main().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
