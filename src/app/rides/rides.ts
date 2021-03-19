import { BoolColumn, ColumnOptions, Context, DateColumn, DateTimeColumn, EntityClass, IdEntity, NumberColumn, StringColumn, ValueListColumn } from '@remult/core';
import { LocationColumn } from '../locations/locations';
import { PatientColumn } from '../patients/patients';
import { UserColumn } from '../users/users';

class DateColumnExt extends DateColumn {
    getDayStr() {
        switch (this.getDayOfWeek()) {
            case 0:
                return 'ראשון';
            case 1:
                return 'שני';
            case 2:
                return 'שלישי';
            case 3:
                return 'רביעי';
            case 4:
                return 'חמישי';
            case 5:
                return 'שישי';
            case 6:
                return 'שבת';
            default:
                return '';
        }
    }
}

@EntityClass
export class Rides extends IdEntity {
    driver = new UserColumn(this.context, () => ({
        fromLocation: this.from.value,
        toLocation: this.to.value,
        dayOfWeek: this.theDate.getDayStr(),
        timeOfDay: this.timeOfDay.toStr(),
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


export class timeOfDay {
    static morning = new timeOfDay();
    static evening = new timeOfDay();
    constructor() {

    }
}
export class TimeOfDayColumn extends ValueListColumn<timeOfDay>{
    constructor(options?: ColumnOptions<timeOfDay>) {
        super(timeOfDay, options);
    }
    toStr() {
        if (this == timeOfDay.evening) {
            return "evening";
        } else if (this == timeOfDay.morning) {
            return "morning";
        } else {
            return "";
        }
    }
}