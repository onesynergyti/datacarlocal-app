import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header-modal',
  templateUrl: './header-modal.component.html',
  styleUrls: ['./header-modal.component.scss'],
})
export class HeaderModalComponent implements OnInit {

  @Input() titulo: string
  @Input() ocultarConclusao: boolean = false
  @Output() onConfirmar: EventEmitter<any> = new EventEmitter<any>();
  @Output() onCancelar: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {}

  cancelar() {
    this.onCancelar.emit()
  }

  confirmar() {
    this.onConfirmar.emit()
  }

}
