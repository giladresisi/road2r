import { Component, OnInit } from '@angular/core';
import { BusyService } from '@remult/angular';
import { Context, StringColumn } from '@remult/core';
import { InputAreaComponent } from '../common/input-area/input-area.component';
import { Rides } from '../rides/rides';
import { Patients } from './patients';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {

  constructor(private context: Context,private busy:BusyService) { }
  search = new StringColumn('Search Patient Name', {
    valueChange: () => {
      this.busy.donotWait(async ()=>await this.patients.reloadData());
    }
  });
  patients = this.context.for(Patients).gridSettings({
    //allowCRUD: true,
    columnSettings: p => [
      p.name
    ],
    
      where: p => this.search.value? p.name.isContains(this.search):undefined
    ,
    rowButtons: [{
      showInLine: true,
      icon: 'directions_car',
      click: async currentPatient => {
        await currentPatient.showNewRideDialog()
      }
    }]
  });

  async ngOnInit() {
    let count = await this.context.for(Patients).count();
    console.log(count);
  }
  async addPatient(){
    let p = this.context.for(Patients).create();
    await this.context.openDialog(InputAreaComponent,x=>x.args={
      title:'הוספת חולה',
      columnSettings:()=>[
        p.name,
        p.defaultPhone,
        p.defaultBarrier,
        p.defaultHospital,
        p.defaultReqSeats
      ],
      ok:async()=>{
        await p.save();
        await this.patients.reloadData();
      }
    });
  }
}
