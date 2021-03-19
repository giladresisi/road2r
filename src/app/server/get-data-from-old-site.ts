import { Context } from '@remult/core';
import * as fetch from 'node-fetch';
import { LocationColumn, Locations } from '../locations/locations';
import { Patients } from '../patients/patients';
import { timeOfDay } from '../rides/rides';
import { UserPreferredAreas, UserPreferredTimes, Users } from '../users/users';
export async function getDataFromOldSite(context: Context) {
    // return;
    // await getPatients(context);
    return;
    await getVolunteers(context);
}

async function getPatients(context:Context) {
    // for await (let p of context.for(Patients).iterate()) {
    //     await p.delete();
    // }
    // return;
    let patients = await getOldSite("getPatients",{active:true});
    // let counter = 0;
    // for (let p of patients) {
    //     if ((p.Equipment != null) && (p.Equipment.length > 0) && (p.Equipment[0].length > 0)) {
    //         console.log(p.Equipment);
    //     }
    //     if (p.EnglishName = "Anonymous Tarkumiya Shiba") {
    //         counter++;
    //     }
    // }
    // console.log(counter);
    // return;
    let i = 0;
    for (let p of patients) {
        if (p.EnglishName = "Anonymous Tarkumiya Shiba") {
            continue;
        }
        console.log(p.EnglishName + " - " + ((i++) * 100 / patients.length).toFixed());
        let shouldSave = false;
        let patient = await context.for(Patients).findFirst(x => x.name.isEqualTo(p.EnglishName));
        if (!patient) {
            patient = context.for(Patients).create();
            shouldSave = true;
        }
        if (patient.name.value != p.EnglishName) {
            patient.name.value = p.EnglishName;
            shouldSave = true;
        }
        if (patient.defaultPhone.value != p.CellPhone) {
            patient.defaultPhone.value = p.CellPhone;
            shouldSave = true;
        }
        let reqSeats = 1;
        if ((p.NumberOfEscort != null) && (p.NumberOfEscort.length > 0)) {
            reqSeats += Number.parseInt(p.NumberOfEscort);
        }
        if (patient.defaultReqSeats.value != reqSeats) {
            patient.defaultReqSeats.value = reqSeats;
            shouldSave = true;
        }
        let barrier = await context.for(Locations).findFirst(x => x.name.isEqualTo(p.Barrier.Name));
        if (barrier) {
            if (patient.defaultBarrier.value != barrier.id.value) {
                patient.defaultBarrier.value = barrier.id.value;
                shouldSave = true;
            }
        } else {
            patient.defaultBarrier.value = null;
            shouldSave = true;
        }
        let hospital = await context.for(Locations).findFirst(x => x.name.isEqualTo(p.Hospital.Name));
        if (hospital) {
            if (patient.defaultHospital.value != hospital.id.value) {
                patient.defaultHospital.value = hospital.id.value;
                shouldSave = true;
            }
        } else {
            patient.defaultHospital.value = null;
            shouldSave = true;
        }
        console.log(patient.name.value + " - " + i++);
        if (shouldSave) {
            await patient.save();
        }
        // if (i >= 5) {
        //     break;
        // }
    }
}

async function getVolunteers(context: Context) {
    let vols = await getOldSite('getVolunteers', { active: true });
    let i = 0;
    for (let v of vols) {
        console.log(v.DisplayName + " - " + ((i++) * 100 / vols.length).toFixed());
        //   if (v.CellPhone == "0546687991")
        {
            let shouldSave = false;
            let user = await context.for(Users).findFirst(x => x.name.isEqualTo(v.DisplayName));
            if (!user) {
                user = context.for(Users).create();
                shouldSave = true;
            }
            if (user.name.value != v.DisplayName) {
                user.name.value = v.DisplayName;
                shouldSave = true;
            }
            if (user.cellPhone.value != v.CellPhone) {
                user.cellPhone.value = v.CellPhone;
                shouldSave = true;
            }
            if (shouldSave) {
                await user.save();
            }
            for (const pa of await context.for(UserPreferredAreas).find({ where: pa => pa.userId.isEqualTo(user.id) })) {
                await pa.delete();
            }
            for (const pt of await context.for(UserPreferredTimes).find({ where: pt => pt.userId.isEqualTo(user.id) })) {
                await pt.delete();
            }

            let fullVolunteerInfo = await getOldSite('getVolunteer', { displayName: v.DisplayName });
            //console.log({ v, r: fullVolunteerInfo, area: fullVolunteerInfo.PrefArea, time: fullVolunteerInfo.PrefTime });
            for (const route of fullVolunteerInfo.PrefArea) {
                let up = context.for(UserPreferredAreas).create();
                up.userId.value = user.id.value;
                up.fromArea.value = route.split(' - ')[0];;
                up.toArea.value = route.split(' - ')[1];
                await up.save();
            }
            for (const time of fullVolunteerInfo.PrefTime) {
                let pt = context.for(UserPreferredTimes).create();
                pt.userId.value = user.id.value;
                switch (time[0]) {
                    case "ראשון":
                    case "שני":
                    case "שלישי":
                    case "רביעי":
                    case "חמישי":
                    case "שישי":
                    case "שבת":
                        pt.DayOfWeek.value = time[0];
                        break;
                    default:
                        continue;
                }
                switch (time[1]) {
                    case "בוקר":
                        pt.MorningOrAfterNoon.value = timeOfDay.morning;
                        break;
                    case "אחהצ":
                        pt.MorningOrAfterNoon.value = timeOfDay.evening;
                        break;
                    default:
                        continue;
                }
                await pt.save();
            }

        }
    }
}

async function getOldSite(endPoint: string, body: any) {

    let r = await (await fetch("http://40.117.122.242/Prod/Road%20to%20Recovery/pages/WebService.asmx/" + endPoint, {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json; charset=UTF-8",
            "x-requested-with": "XMLHttpRequest",
            "cookie": "ASP.NET_SessionId=1kunol5j4ob2cpangxrwxzxn; username=0546687991"
        },
        "referrer": "http://40.117.122.242/Prod/Road%20to%20Recovery/pages/volunteerForm.html",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify(body),// "{\"displayName\":\"אבישי הכהן\"}",
        "method": "POST",
        "mode": "cors"
    })).json();
    return JSON.parse(r.d);
}
