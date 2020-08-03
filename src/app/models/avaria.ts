export class Avaria {
    Id: number;
    Nome: string;
    PercentualTop: number;
    PercentualLeft: number;
    Cor: string;

    constructor(avaria: Avaria = null) {
        if (avaria != null) {
            this.Id = avaria.Id
            this.Nome = avaria.Nome
            this.PercentualTop = avaria.PercentualTop
            this.PercentualLeft = avaria.PercentualLeft
            this.Cor = avaria.Cor
        }
    }    
}