import { BoolColumn, ColumnOptions, Context, DateColumn, EntityClass, IdEntity, NumberColumn, StringColumn, ValueListColumn } from '@remult/core';
import { LocationColumn } from '../locations/locations';
import { PatientColumn } from '../patients/patients';
import { UserColumn } from '../users/users';

class DateColumnExt extends DateColumn {
   
}

@EntityClass
export class Rides extends IdEntity {
    driver = new UserColumn(this.context, () => ({
        fromLocation: this.from.value,
        toLocation: this.to.value,
        dayOfWeek: this.theDate.value.getDay(),
        timeOfDay: this.timeOfDay.value.id,
    }));
    patient = new PatientColumn(this.context);
    contactPhone = new StringColumn({ caption: "טלפון ליצירת קשר" });
    reqSeats = new NumberColumn({ caption: "מספר מושבים" });
    theDate = new DateColumnExt();
    timeOfDay = new TimeOfDayColumn();
    from = new LocationColumn(this.context, {
        caption: "מוצא",
        dbName: 'from_',
    });
    to = new LocationColumn(this.context, {
        caption: "יעד",
        dbName: 'to_',
    });

    constructor(private context: Context) {
        super({
            name: "Rides",
            allowApiCRUD: true,
            allowApiRead: true
        });
    }

    toggleShowAll() {
        // send () => 
    }
}

export class dayOfWeek{
    static sunday = new dayOfWeek(0);
    static monday = new dayOfWeek(1);
    static tuesday = new dayOfWeek(2);
    static wednesday = new dayOfWeek(3);
    static thursday = new dayOfWeek(4);
    static friday = new dayOfWeek(5);
    static saturday = new dayOfWeek(6);
    constructor(public id:number,public caption?:string){

    }
}
export class DayOfWeekColumn extends ValueListColumn<dayOfWeek>{
    constructor(options?: ColumnOptions<dayOfWeek>) {
        super(dayOfWeek, options);
    }
  
}

export class timeOfDay {
    static morning = new timeOfDay();
    static evening = new timeOfDay();
    constructor(public id?:string){

    }
}

export class TimeOfDayColumn extends ValueListColumn<timeOfDay>{
    constructor(options?: ColumnOptions<timeOfDay>) {
        super(timeOfDay, options);
    }
  
}
