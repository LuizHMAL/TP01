interface AlunoProps{
    matricula: number;
    nome: string;
    cpf: string;
    curso: string;
    filiacao: string;
    ingresso: Date;
    ca: number;
}

    class Aluno {
    matricula: number;
    nome: string;
    cpf: string;
    curso: string;
    filiacao: string;
    ingresso: Date;
    ca: number;

    constructor(props: AlunoProps) {
        this.matricula = props.matricula;
        this.nome = props.nome;
        this.cpf = props.cpf;
        this.curso = props.curso;
        this.filiacao = props.filiacao;
        this.ingresso = props.ingresso;
        this.ca = props.ca;
    }
}
export default Aluno;

