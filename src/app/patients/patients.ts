import { EntityClass, IdEntity, StringColumn } from '@remult/core';

@EntityClass
export class Patients extends IdEntity {
    name = new StringColumn();
    constructor() {
        super({
            name: "Drivers",
            allowApiCRUD:true,
            allowApiRead:true
        });
    }
}
