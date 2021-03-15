import { Component, OnInit } from '@angular/core';
import { BusyService } from '@remult/angular';
import { Context, StringColumn } from '@remult/core';
import { Locations } from './locations';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  search = new StringColumn('Search Location Name', {
    valueChange: () => {
      this.busy.donotWait(async ()=>await this.locations.getRecords());
    }
  });

  constructor(private context: Context,private busy:BusyService) { }
  locations = this.context.for(Locations).gridSettings({
    allowCRUD: true,
    get: {
      where: l => this.search.value? l.name.isContains(this.search):undefined
    }
  });

  ngOnInit() {

  }
}
