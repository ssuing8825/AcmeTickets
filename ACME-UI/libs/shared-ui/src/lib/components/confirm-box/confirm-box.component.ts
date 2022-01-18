import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ConfirmBoxData } from './confirm-box-data.interface';

@Component({
  selector: 'global-lib-confirm-box',
  templateUrl: './confirm-box.component.html',
  styleUrls: ['./confirm-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmBoxComponent {
  @Input() confirmTooltip = '';
  @Input() cancelTooltip = '';

  constructor(public dialogRef: MatDialogRef<ConfirmBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: ConfirmBoxData) {}

  onSelection(confirm: boolean): void {
    this.dialogRef.close(confirm);
  }
}
