import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './Guard/auth.guard';
import { RoleGuard } from './Guard/role.guard';
import { ItemCreateComponent } from './item/item-create/item-create.component';
import { ItemListComponent } from './item/item-history/item-list.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  { path: '', component: UserCreateComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset/:token', component: ResetPasswordComponent},

  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  { path: 'item', component: ItemListComponent },
  { path: 'item/create', component: ItemCreateComponent },
  { path: 'item/items', component: ItemListComponent },
  { path: 'edit/:itemId', component: ItemCreateComponent },
  { path: 'delete/:itemId', component: ItemCreateComponent },

  { path: '**', redirectTo: '' }
  // { path: 'admin', component: AdminComponent, canActivate: [RoleGuard], data: { expectedRole: ['Admin'] } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
