import { Component, OnInit } from '@angular/core';
import { Context } from '@remult/core';
import { Drivers } from './drivers';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {

  constructor(private context:Context) { }
  drivers = this.context.for(Drivers).gridSettings({allowCRUD:true});

  ngOnInit() {
    
  }
}
