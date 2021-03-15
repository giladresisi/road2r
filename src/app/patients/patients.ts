import { Context, EntityClass, IdColumn, IdEntity, NumberColumn, StringColumn } from '@remult/core';
import { InputAreaComponent } from '../common/input-area/input-area.component';
import { LocationColumn } from '../locations/locations';
import { Rides, timeOfDay } from '../rides/rides';

@EntityClass
export class Patients extends IdEntity {
    async showNewRideDialog() {
        let newRide = this.context.for(Rides).create();
        newRide.patient.value = this.id.value;
        newRide.from.value = this.defaultBarrier.value;
        newRide.to.value = this.defaultHospital.value;
        newRide.contactPhone.value = this.defaultPhone.value;
        newRide.reqSeats.value = this.defaultReqSeats.value;
        let d = new Date();
        d.setDate(d.getDate() + 1);
        newRide.theDate.value = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        newRide.timeOfDay.value = timeOfDay.morning;


        await this.context.openDialog(InputAreaComponent,
            inputArea => inputArea.args = {
                title: 'Add Ride',
                columnSettings: () => [
                    newRide.theDate,
                    newRide.timeOfDay,
                    newRide.from,
                    newRide.to,
                    newRide.contactPhone,
                    newRide.reqSeats
                ],
                ok: async () => {
                    await newRide.save();
                }
            });
    }
    name = new StringColumn();
    defaultPhone = new StringColumn();
    defaultBarrier = new LocationColumn(this.context, { caption: 'מחסום' });
    defaultHospital = new LocationColumn(this.context, { caption: 'בית חולים' });
    defaultReqSeats = new NumberColumn({ caption: 'מספר מושבים' });
    constructor(private context: Context) {
        super({
            name: "Patients",
            allowApiCRUD: true,
            allowApiRead: true
        });
    }
}

export class PatientColumn extends IdColumn {
    constructor(context: Context) {
        super({
            caption: 'חולה',
            dataControlSettings: () => ({
                valueList: () => context.for(Patients).getValueList()
            })
        })
    }
}
