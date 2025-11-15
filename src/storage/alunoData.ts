import { Aluno } from '../model/Aluno.js';
import { writeFile, readFile } from "fs/promises";



const FILE_PATH = 'alunos.dat';
const encoding = 'utf-8';

export async function saveAlunos(alunos: Aluno | Aluno[]) {
	const data = JSON.stringify(alunos, null, 2);
	try {
		await writeFile(FILE_PATH, data, { encoding });
	} catch (err) {
		throw err;
	}
}

export async function readAlunos(): Promise<Aluno[] | null> {
	try {
		const content = await readFile(FILE_PATH, { encoding });
		return JSON.parse(content) as Aluno[];
	} catch (err) {
		return null;
	}
}

