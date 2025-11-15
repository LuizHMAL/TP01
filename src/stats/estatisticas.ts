import fs from 'fs/promises';
import path from 'path';

export type BlockMapLine = { index: number; usedBytes: number; occupancyPct: number };

export async function gerarMapaEBaixarRelatorio(
  blocks: Buffer[],
  outDir = 'output',
  titulo = 'Resultado'
) {
  await fs.mkdir(outDir, { recursive: true });
  const blockSize = blocks.length ? blocks[0].length : 0;
  const mapa: BlockMapLine[] = [];
  let totalUsed = 0;
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    let used = 0;
    for (let j = 0; j < b.length; j++) {
      const byte = b[j];
      if (byte !== 0 && byte !== 35) used++;
    }
    const pct = blockSize === 0 ? 0 : (used / blockSize) * 100;
    mapa.push({ index: i, usedBytes: used, occupancyPct: Math.round(pct * 100) / 100 });
    totalUsed += used;
  }

  const totalBlocks = blocks.length;
  const partiallyUsed = mapa.filter(m => m.usedBytes > 0 && m.usedBytes < blockSize).length;
  const avgOccupancy = totalBlocks === 0 ? 0 : (mapa.reduce((s, m) => s + m.occupancyPct, 0) / totalBlocks);
  const efficiency = blocks.length === 0 ? 0 : (totalUsed / (blocks.length * blockSize)) * 100;


  const lines: string[] = [];
  lines.push(`${titulo}`);
  lines.push(`BlocoSize: ${blockSize} bytes`);
  lines.push(`Total de blocos: ${totalBlocks}`);
  lines.push(`Blocos parcialmente usados: ${partiallyUsed}`);
  lines.push(`Ocupação média (% por bloco): ${avgOccupancy.toFixed(2)}`);
  lines.push(`Eficiência total (% bytes úteis): ${efficiency.toFixed(2)}`);
  lines.push('');
  for (const m of mapa) {
    lines.push(`Bloco ${m.index + 1}: ${blockSize} bytes (${m.usedBytes} bytes usados) - ${m.occupancyPct}%`);
  }

  const mapaPath = path.join(outDir, 'mapa_blocos.txt');
  await fs.writeFile(mapaPath, lines.join('\n'));

  const rel = [
    `Relatório - ${titulo}`,
    `Gerado em: ${new Date().toISOString()}`,
    `Total Blocos: ${totalBlocks}`,
    `Blocos parcialmente usados: ${partiallyUsed}`,
    `Ocupação média por bloco: ${avgOccupancy.toFixed(2)}%`,
    `Eficiência total: ${efficiency.toFixed(2)}%`,
    '',
    'Detalhes dos blocos:',
    ...lines.slice(6)
  ];
  const relPath = path.join(outDir, 'relatorio.txt');
  await fs.writeFile(relPath, rel.join('\n'));
  return { mapa, relPath, mapaPath, stats: { totalBlocks, partiallyUsed, avgOccupancy, efficiency } };
}
