import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, SimpleChanges, SimpleChange } from '@angular/core';
import { Avaria } from '../../models/avaria'

@Component({
  selector: 'app-avaria',
  templateUrl: './avaria.component.html',
  styleUrls: ['./avaria.component.scss'],
})
export class AvariaComponent implements OnInit {

  @Input() imagemVistoria: string
  @Input() avarias: any
  @Input() idSelecionado: number
  @Output() onCriarAvaria: EventEmitter<any> = new EventEmitter<any>();  
  @Output() onSelecionarAvaria: EventEmitter<any> = new EventEmitter<any>();  
  @ViewChild('imgAvaria') imgAvaria: ElementRef;
  tamanhoMarcador = 0.0225

  constructor() { }

  ngOnInit() {}

  get tamanhoImagem() {
    if (this.imgAvaria != null)
      return {width: (this.imgAvaria.nativeElement as HTMLImageElement).width, height: (this.imgAvaria.nativeElement as HTMLImageElement).height}
    else
      return {width: 0, height: 0}
  }

  criarAvaria(event) {
    let avariaTratada = new Avaria()
    avariaTratada.PercentualTop = (event.offsetY - this.tamanhoImagem.width * this.tamanhoMarcador) / this.tamanhoImagem.height
    avariaTratada.PercentualLeft = (event.offsetX - this.tamanhoImagem.width * this.tamanhoMarcador) / this.tamanhoImagem.width

    this.onCriarAvaria.emit(avariaTratada)
  }

  selecionarAvaria(avaria: Avaria) {
    this.onSelecionarAvaria.emit(avaria)
  }

  estiloMarcador(avaria) {
    return {
      'position': 'absolute',
      'top': avaria.PercentualTop * 100 + '%', 
      'left': avaria.PercentualLeft * 100 + '%', 
      'background-color': avaria.Cor,
      'width': this.tamanhoImagem.width * this.tamanhoMarcador + 'px',
      'height': this.tamanhoImagem.width * this.tamanhoMarcador + 'px'
    }
  }
}