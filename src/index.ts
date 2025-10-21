import Aluno from "./model/Aluno";
import { saveAlunos, readAlunos } from "./data/alunoData";


const aluno1 = new Aluno({
    matricula: 12345,
    nome: "Luiz",
    cpf: "132465",
    curso: "Computacao",
    filiacao:"Vicente e Riselda",
    ingresso: new Date("2023-02-10"),
    ca: 8.8,
});
console.log(aluno1);

saveAlunos(aluno1)
