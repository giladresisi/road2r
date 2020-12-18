import { Context, DateColumn, EntityClass, IdColumn, IdEntity, NumberColumn } from '@remult/core';
import { DriverColumn, Drivers } from '../drivers/drivers';
import { PatientColumn, Patients } from '../patients/patients';

@EntityClass
export class Rides extends IdEntity {
    driver = new DriverColumn();
    patient = new PatientColumn(this.context);
    req_seats = new NumberColumn();
    time = new DateColumn();
    constructor(private context:Context) {
        super({
            name: "Rides",
            allowApiCRUD:true,
            allowApiRead:true
        }); 
    }
}