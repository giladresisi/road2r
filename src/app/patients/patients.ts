import { Context, EntityClass, IdColumn, IdEntity, StringColumn } from '@remult/core';

@EntityClass
export class Patients extends IdEntity {
    name = new StringColumn();
    constructor() {
        super({
            name: "Patients",
            allowApiCRUD:true,
            allowApiRead:true
        });
    }
}

export class PatientColumn extends IdColumn{
    constructor(context:Context){
        super({
            caption:'חולה',
            dataControlSettings:()=>({
                valueList:()=>context.for(Patients).getValueList()
            })
        })
    }
}
