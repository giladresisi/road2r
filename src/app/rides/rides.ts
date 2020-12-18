import { Context, DateColumn, EntityClass, IdEntity, NumberColumn } from '@remult/core';
import { PatientColumn, Patients } from '../patients/patients';
import { UserColumn } from '../users/users';

@EntityClass
export class Rides extends IdEntity {
    driver = new UserColumn(this.context);
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