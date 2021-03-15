import { Component, OnInit } from '@angular/core';
import { Context } from '@remult/core';
import { InputAreaComponent } from '../common/input-area/input-area.component';
import { Patients } from '../patients/patients';
import { Rides } from './rides';

@Component({
  selector: 'app-rides',
  templateUrl: './rides.component.html',
  styleUrls: ['./rides.component.scss']
})
export class RidesComponent implements OnInit {
  constructor(private context: Context) { }
  rides = this.context.for(Rides).gridSettings(
    {
      allowCRUD: true,
      columnSettings: r => [
        r.patient,
        r.theDate,
        r.driver,
        r.from,
        r.to,
        r.contactPhone,
        r.reqSeats
      ],
      rowButtons: [{
        textInMenu: 'הצג את כל הנהגים',
        click: r => {
          r.toggleShowAll();
        }
      }],
    });
  async ngOnInit() {
    for await (let r of this.context.for(Rides).iterate()) {
      console.log("patient - " + r.patient.value);
    }
  }
  async addRide(){
    let r = this.context.for(Rides).create();
    await this.context.openDialog(InputAreaComponent,x=>x.args={
      title:'הוספת נסיעה',
      columnSettings:()=>[
        r.patient,
        r.theDate,
        r.from,
        r.to,
        r.contactPhone,
        r.reqSeats
      ],
      ok:async()=>{
        await r.save();
        await this.rides.getRecords();
      }
    });
  }
}
