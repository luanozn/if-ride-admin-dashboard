import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationDetailsDialog } from '../application-details-dialog/application-details-dialog';
import { MatButton } from '@angular/material/button';
import { NgForOf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-applications',
  imports: [MatButton, NgForOf, MatIcon],
  templateUrl: './application-list.html',
})
export class ApplicationList {
  solicitacoes = [
    { id: 1, nome: 'João Silva', cnh: '123456789', status: 'PENDENTE' },
    { id: 2, nome: 'Pedro Pereira', cnh: '987654312', status: 'APPROVED' },
  ];

  constructor(private dialog: MatDialog) {}

  abrirDetalhes(usuario: any) {
    const dialogRef = this.dialog.open(ApplicationDetailsDialog, {
      width: '500px',
      data: usuario,
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado?.action === 'REJECT') {
        console.log('Recusado por:', resultado.reason);
      } else if (resultado?.action === 'APPROVE') {
        console.log('Aprovado');
      }
    });
  }
}
