import { DateColumn, EntityClass, IdEntity, NumberColumn } from '@remult/core';
import { Drivers } from '../drivers/drivers';
import { Patients } from '../patients/patients';

@EntityClass
export class Rides extends IdEntity {
    driver = new Drivers();
    patient = new Patients();
    req_seats = new NumberColumn();
    time = new DateColumn();
    constructor() {
        super({
            name: "Rides",
            allowApiCRUD:true,
            allowApiRead:true
        });
    }
}