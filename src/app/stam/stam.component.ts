import { Component, OnInit } from '@angular/core';
import { Context } from '@remult/core';
import { DialogService } from '../common/dialog';
import { Patients } from '../patients/patients';

@Component({
  selector: 'app-stam',
  templateUrl: './stam.component.html',
  styleUrls: ['./stam.component.scss']
})
export class StamComponent implements OnInit {

  constructor(private context: Context, private dialog: DialogService) { }
  patients: OrigAppPatient[] = [];
  async ngOnInit() {
    this.patients = JSON.parse(localStorage.getItem("test"));
    for await (let l of this.context.for(Patients).iterate()) {
      this.existing.add(l.name.value);
    }
  }
  existing = new Set<string>();
  async insert(h: OrigAppPatient) {
    let l = await this.context.for(Patients).findFirst(l => l.name.isEqualTo(h.DisplayName));
    if (!l) {
      l = this.context.for(Patients).create();
    }
    l.name.value = h.DisplayName;
    await l.save();

  }
  async addAll() {
    for (const h of this.patients) {
      await this.insert(h);
    }
  }

}


export interface Responsible {
  Statusim?: any;
  RegId?: any;
  Remarks?: any;
  JoinDate: Date;
  IsActive: boolean;
  PrefArea?: any;
  PrefLocation?: any;
  PrefTime?: any;
  AvailableSeats: number;
  UserName?: any;
  DriverType?: any;
  Id: number;
  DisplayName: string;
  FirstNameH?: any;
  FirstNameA?: any;
  LastNameH?: any;
  LastNameA?: any;
  CellPhone?: any;
  CellPhone2?: any;
  HomePhone?: any;
  City?: any;
  Address?: any;
  Gender?: any;
  TypeVol?: any;
  Email?: any;
  PreferRoute1?: any;
  PreferRoute2?: any;
  PreferRoute3?: any;
  Day1?: any;
  Day2?: any;
  Day3?: any;
  Hour1?: any;
  Hour2?: any;
  Hour3?: any;
  Status?: any;
  Device?: any;
  EnglishName?: any;
  IsAssistant: boolean;
  LastModified?: any;
  VolunteerIdentity?: any;
  KnowsArabic?: any;
  EnglishFN?: any;
  EnglishLN?: any;
  IsDriving?: any;
  HowCanHelp?: any;
  Feedback?: any;
  BirthDate?: any;
  NewsLetter?: any;
  Refered?: any;
  RoleInR2R?: any;
  JoinYear?: any;
  PostalCode?: any;
  Source?: any;
  Rounds?: any;
  AnsweredPrevQues?: any;
  GalitRemarks?: any;
  WorkingWithCoor?: any;
  WorkingWithPat?: any;
  HowToRecruit?: any;
  HowKeepInTouch?: any;
  NewsLetterRemarks?: any;
  GasRemarks?: any;
  IgulLetova?: any;
  Role?: any;
}

export interface OrigAppBarrier {
  IsActive: boolean;
  Type?: any;
  Name: string;
  Area?: any;
  Direction?: any;
  Responsible?: any;
  Status?: any;
  Remarks?: any;
  ManagerName?: any;
  ManagerLastName?: any;
  ManagerPhones?: any;
  ManagerPhones2?: any;
  EnglishName: string;
}

export interface OrigAppHospital {
  IsActive: boolean;
  Type: string;
  Name: string;
  Area: string;
  Direction: string;
  Responsible: Responsible;
  Status?: any;
  Remarks: string;
  ManagerName: string;
  ManagerLastName: string;
  ManagerPhones: string;
  ManagerPhones2?: any;
  EnglishName: string;
}

export interface OrigAppPatient {
  IsActive: boolean;
  pnRegId?: any;
  Id: number;
  Equipment: string[];
  DisplayNameA: string;
  DisplayName: string;
  FirstNameH: string;
  FirstNameA: string;
  LastNameH: string;
  LastNameA: string;
  BirthDate: string;
  City: string;
  Barrier: OrigAppBarrier;
  Hospital: OrigAppHospital;
  Department: string;
  Gender: string;
  CellPhone: string;
  CellPhone1: string;
  HomePhone: string;
  LivingArea: string;
  EscortedList?: any;
  RidePatList?: any;
  Addition?: any;
  History: string;
  Status?: any;
  Remarks: string;
  NumberOfEscort: string;
  IsAnonymous: string;
  EnglishName: string;
  PatientIdentity: number;
  LastModified: string;
}
