import { Component, OnInit } from '@angular/core';
import { Context } from '@remult/core';
import { Patients } from './patients';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {

  constructor(private context:Context) { }
  patients = this.context.for(Patients).gridSettings({allowCRUD:true});

  ngOnInit() {
    
  }
}
