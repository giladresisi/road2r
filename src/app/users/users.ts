
import { IdEntity, IdColumn, checkForDuplicateValue, StringColumn, BoolColumn, ColumnOptions, ServerFunction, ValueListTypeInfo } from "@remult/core";
import { changeDate } from '../shared/types';
import { Context, EntityClass } from '@remult/core';
import { Roles } from './roles';
import { SelectValueDialogComponent } from '@remult/angular';
import { Locations } from '../locations/locations';
import { dayOfWeek, DayOfWeekColumn, timeOfDay, TimeOfDayColumn } from "../rides/rides";




@EntityClass
export class Users extends IdEntity {

    constructor(private context: Context) {

        super({
            name: "Users",
            allowApiRead: true,
            allowApiDelete: true,
            allowApiUpdate: true,
            allowApiInsert: true,
            saving: async () => {
                if (context.onServer) {
                    if (this.password.value && this.password.value != this.password.originalValue && this.password.value != Users.emptyPassword) {
                        this.realStoredPassword.value = Users.passwordHelper.generateHash(this.password.value);
                    }
                    if ((await context.for(Users).count()) == 0)
                        this.admin.value = true;

                    await checkForDuplicateValue(this, this.name, this.context.for(Users));
                    if (this.isNew())
                        this.createDate.value = new Date();
                }
            },
            apiDataFilter: () => {
                return undefined;
                if (!context.isSignedIn())
                    return this.id.isEqualTo("No User");
                else if (!(context.isAllowed(Roles.admin)))
                    return this.id.isEqualTo(this.context.user.id);
            }
        });
    }
    public static emptyPassword = 'password';
    name = new StringColumn({
        caption: "שם",
        validate: () => {
            if (!this.name.value || this.name.value.length < 2)
                this.name.validationError = 'שם קצר מדי';
        }
    });
    cellPhone = new StringColumn({
        caption: "נייד",
        validate: () => {
            return;
            if (!this.cellPhone.value || this.cellPhone.value.length != 9 ||
                !this.cellPhone.value.startsWith('05'))
                this.cellPhone.validationError = 'מספר נייד לא חוקי';
        }
    });

    realStoredPassword = new StringColumn({
        dbName: 'password',
        includeInApi: false
    });
    password = new StringColumn({ caption: 'password', dataControlSettings: () => ({ inputType: 'password' }), serverExpression: () => this.realStoredPassword.value ? Users.emptyPassword : '' });

    createDate = new changeDate('Create Date');



    admin = new BoolColumn();
    static passwordHelper: PasswordHelper = {
        generateHash: x => { throw ""; },
        verify: (x, y) => { throw ""; }
    };

}
export interface PasswordHelper {
    generateHash(password: string): string;
    verify(password: string, realPasswordHash: string): boolean;
}


// export class UserId extends IdColumn {
//     constructor(private context: Context, settingsOrCaption?: ColumnOptions<string>) {
//         super({
//             dataControlSettings: () => ({
//                 getValue: () => this.displayValue,
//                 hideDataOnInput: true,
//                 width: '200'
//             })
//         }, settingsOrCaption);
//     }

//     get displayValue() {
//         return this.context.for(Users).lookup(this).name.value;
//     }
// }

export class UserColumn extends IdColumn {
    @ServerFunction({ allowed: true })
    static async getDrivers(filter: filterDrivers, context?: Context) {
        let relevantDriverIdsAreas: string[] = [];
        let relevantDriverIdsTimes: string[] = [];
        let relevantDriverIds: string[] = [];
        let drivers: Users[] = [];
        if (filter) {
            let lFrom = await context.for(Locations).findId(filter.fromLocation);
            let lto = await context.for(Locations).findId(filter.toLocation);
            relevantDriverIdsAreas.push(...(await context.for(UserPreferredAreas).find({
                where: up => {
                    if (lFrom.area.value == lto.area.value) {
                        return up.fromArea.isEqualTo(lFrom.area.value).and(up.toArea.isEqualTo(''));
                    }
                    else
                        return up.fromArea.isEqualTo(lFrom.area.value).and(
                            up.toArea.isEqualTo(lto.area.value) // should include those for which up.from/toArea = ''
                        ).or(up.fromArea.isEqualTo(lto.area.value).and(
                            up.toArea.isEqualTo(lFrom.area.value) // should include those for which up.from/toArea = ''
                        ));
                }
            })).map(x => x.userId.value));
            relevantDriverIdsTimes.push(...(await context.for(UserPreferredTimes).find({
                where: up => up.DayOfWeek.isEqualTo(ValueListTypeInfo.get(dayOfWeek).byId(filter.dayOfWeek)).and(
                    up.MorningOrAfterNoon.isEqualTo(ValueListTypeInfo.get(timeOfDay).byId(filter.timeOfDay))
                )
            })).map(x => x.userId.value));
            for (const x of relevantDriverIdsAreas) {
                if (relevantDriverIdsTimes.includes(x)) {
                    relevantDriverIds.push(x);
                }
            }
            if (relevantDriverIds.length > 0)
                drivers = await context.for(Users).find({ where: u => u.id.isIn(...relevantDriverIds) });
        }
        else
            drivers = await context.for(Users).find();

        return drivers.map(x => ({
            caption: x.name.value,
            id: x.id.value
        }));
    }
    constructor(private context: Context, getFilterDrivers?: () => filterDrivers) {
        super({
            caption: 'נהג',
            dataControlSettings: () => ({
                getValue: () => this.displayValue,
                hideDataOnInput: true,
                click: async () => {
                    if (!getFilterDrivers)
                        getFilterDrivers = () => undefined;
                    let valuesForSelection: any[] = [];
                    valuesForSelection.push({ caption: '<הסר נהג נוכחי>', id: '' });
                    valuesForSelection.push(...await UserColumn.getDrivers(getFilterDrivers()));
                    context.openDialog(SelectValueDialogComponent, x => x.args({
                        values: valuesForSelection,
                        onSelect: selectedValue => {
                            this.value = selectedValue.id
                        }
                    })
                    )
                },
            })
        })
    }
    //@ts-ignore
    get displayValue() {
        let s = this.context.for(Users).lookup(this).name.value;
        if (!s) {
            return '<בחר נהג>';
        }
        return s;
    }
}
export interface filterDrivers {
    fromLocation: string,
    toLocation: string,
    dayOfWeek: number,
    timeOfDay: string,
}

@EntityClass
export class UserPreferredTimes extends IdEntity {
    userId = new UserColumn(this.context);
    DayOfWeek = new DayOfWeekColumn({ dbName: 'dayOfWeekInt' });
    MorningOrAfterNoon = new TimeOfDayColumn();
    constructor(private context: Context) {
        super({
            name: 'UserPreferredTimes',
            allowApiCRUD: true
        });
    }
}
@EntityClass
export class UserPreferredAreas extends IdEntity {
    userId = new UserColumn(this.context);
    fromArea = new StringColumn();
    toArea = new StringColumn();
    constructor(private context: Context) {
        super({
            name: 'UserPreferredAreas',
            allowApiCRUD: true
        });
    }
}
