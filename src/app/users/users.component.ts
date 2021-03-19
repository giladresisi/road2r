import { Component, OnInit } from '@angular/core';
import { UserPreferredAreas, UserPreferredTimes, Users } from './users';
import { Context, ServerFunction } from '@remult/core';

import { DialogService } from '../common/dialog';
import { Roles } from './roles';
import { InputAreaComponent } from '../common/input-area/input-area.component';
import { GridDialogComponent } from '../common/grid-dialog/grid-dialog.component';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  constructor(private dialog: DialogService, public context: Context) {
  }
  isAdmin() {
    return this.context.isAllowed(Roles.admin);
  }

  users = this.context.for(Users).gridSettings({
    allowDelete: true,
    allowInsert: true,
    allowUpdate: true,
    numOfColumnsInGrid: 2,
    rowButtons: [{
      textInMenu: 'אזורים מועדפים',
      click: u => {
        this.context.openDialog(GridDialogComponent,
          x => x.args = {
            title: 'אזורים מועדפים',
            settings: this.context.for(UserPreferredAreas).gridSettings({
              allowCRUD:true,
              columnSettings:up=>[up.fromArea,up.toArea],
              get: {
                where: up => up.userId.isEqualTo(u.id),
              }, newRow: up => up.userId.value = u.id.value
            })
          });
      }
    },
    {
      textInMenu: 'זמנים מועדפים',
      click: u => {
        this.context.openDialog(GridDialogComponent,
          x => x.args = {
            title: 'זמנים מועדפים',
            settings: this.context.for(UserPreferredTimes).gridSettings({
              allowCRUD:true,
              columnSettings:up=>[up.DayOfWeek,up.MorningOrAfterNoon],
              get: {
                where: up => up.userId.isEqualTo(u.id),
              }, newRow: up => up.userId.value = u.id.value
            })
          });
      }
    }],
    get: {
      orderBy: h => [h.name],
      limit: 100
    },
    columnSettings: users => [
      users.name,
      users.admin
    ],
    confirmDelete: async (h) => {
      return await this.dialog.confirmDelete(h.name.value)
    },
  });


  async resetPassword() {
    if (await this.dialog.yesNoQuestion("Are you sure you want to delete the password of " + this.users.currentRow.name.value)) {
      await UsersComponent.resetPassword(this.users.currentRow.id.value);
      this.dialog.info("Password deleted");
    };

  }
  @ServerFunction({ allowed: c => c.isAllowed(Roles.admin) })
  static async resetPassword(userId: string, context?: Context) {
    let u = await context.for(Users).findId(userId);
    if (u) {
      u.realStoredPassword.value = '';
      await u.save();
    }
  }



  ngOnInit() {
  }

}
