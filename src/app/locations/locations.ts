import { ColumnOptions, Context, EntityClass, IdColumn, IdEntity, StringColumn } from '@remult/core';

@EntityClass
export class Locations extends IdEntity {
    name = new StringColumn();
    area = new StringColumn();
    constructor() {
        super({
            name: "Locations",
            allowApiCRUD:true,
            allowApiRead:true
        });
    }
}

export class LocationColumn extends IdColumn{
    constructor(context:Context, options: ColumnOptions<string>){
        super({
            dataControlSettings:()=>({
                valueList:()=>context.for(Locations).getValueList()
            })
        },options)
    }
}
