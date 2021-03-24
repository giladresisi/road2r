import { Component, OnInit } from '@angular/core';
import { Context } from '@remult/core';
import { InputAreaComponent } from '../common/input-area/input-area.component';
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
        { column: r.patient, readOnly: true },
        r.theDate,
        r.timeOfDay,
        r.driver,
        r.from,
        r.to,
        r.contactPhone,
        r.reqSeats
      ],
      rowButtons: [{
        showInLine: true,
        icon: 'visibility',
        textInMenu: 'הצג את כל הנהגים',
        click: r => {
          r.toggleShowAll();
        }
      }],
    });
  async ngOnInit() {

  }
  async addRide() {
    let r = this.context.for(Rides).create();
    await this.context.openDialog(InputAreaComponent, x => x.args = {
      title: 'הוספת נסיעה',
      columnSettings: () => [
        r.patient,
        r.theDate,
        r.timeOfDay,
        r.from,
        r.to,
        r.contactPhone,
        r.reqSeats
      ],
      ok: async () => {
        await r.save();
        await this.rides.reloadData();
      }
    });
  }
}
