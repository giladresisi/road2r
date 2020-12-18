import { EntityClass, IdEntity, StringColumn, NumberColumn, IdColumn } from '@remult/core';

@EntityClass
export class Drivers extends IdEntity {
    name = new StringColumn();
    max_seats = new NumberColumn();
    constructor() {
        super({
            name: "Drivers",
            allowApiCRUD:true,
            allowApiRead:true
        });
    }
}
export class DriverColumn extends IdColumn{

}
