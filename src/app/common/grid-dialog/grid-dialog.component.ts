import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogConfig } from '@remult/angular';
import {  GridSettings } from '@remult/core';



@Component({
  selector: 'app-grid-dialog',
  template: `<form>
  <h3 matDialogHeader>{{args.title}}</h3>
  <div mat-dialog-content>
    <data-grid [settings]="args.settings" height="300"> </data-grid>
  </div>

  <mat-dialog-actions>

    <button mat-raised-button *ngFor="let b of args.buttons" (click)="buttonClick(b,$event)">
      {{b.text}}
    </button>
    <button type="button" mat-raised-button color="warning" (click)="this.dialogRef.close()" *ngIf="this.args.cancel">
      בטל
    </button>

    <button type="submit" mat-raised-button color="accent" (click)="confirm()">
      אשר
    </button>

  </mat-dialog-actions>
</form>`
  
})
@DialogConfig({

  minWidth: '95vw'
})
export class GridDialogComponent implements OnInit {

  args: {
    title: string,
    settings: GridSettings<any>,
    ok?: () => void,
    cancel?: () => void,
    validate?: () => Promise<void>,
    buttons?: button[]
  };

  constructor(
    public dialogRef: MatDialogRef<any>

  ) {

    dialogRef.afterClosed().toPromise().then(x => this.cancel());
  }


  ngOnInit() {

  }
  cancel() {
    if (!this.ok && this.args.cancel)
      this.args.cancel();

  }
  ok = false;
  async confirm() {
    if (this.args.validate) {
      try {
        await this.args.validate();
      }
      catch{
        return;
      }
    }
    if (this.args.ok)
      await this.args.ok();
    this.ok = true;
    this.dialogRef.close();
    
  }
  buttonClick(b: button, e: MouseEvent) {
    e.preventDefault();
    b.click(() => {
      this.dialogRef.close();
    });
  }


}


export interface button {
  text: string,
  click: ((close: () => void) => void);
}