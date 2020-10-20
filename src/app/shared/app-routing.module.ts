import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../component/login/login.component';
import { AuthGuard } from '../injectable/auth/auth.guard';
import { ShowMessageComponent } from '../component/show-message/show-message.component';
import { ResetPasswordComponent } from '../component/reset-password/reset-password.component';
import { ChangePasswordComponent } from '../component/change-password/change-password.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DistributionListComponent } from '../component/distribution-list/distribution-list.component';
import { RefreshComponent } from '../component/refresh/refresh.component';
import { AreaSearchComponent } from '../component/area-search/area-search.component';
import { SendersComponent } from '../component/senders/senders.component';
import { AreaDrawComponent } from '../component/area-draw/area-draw.component';
import { NewMessageComponent } from '../component/show-message/new-message/new-message.component';

const routes: Routes = [
  // <Production routing:>
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'messages', component: ShowMessageComponent, canActivate: [AuthGuard] },
  { path: 'newMessage', component: NewMessageComponent, canActivate: [AuthGuard] },
  { path: 'refreshComponent', component: RefreshComponent, canActivate: [AuthGuard] },
  { path: 'distribution-list', component: DistributionListComponent, canActivate: [AuthGuard] },
  { path: 'senders', component: SendersComponent, canActivate: [AuthGuard] },
  // { path: 'distribution-list-users/:id', component: DistributionListUsersComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/messages', pathMatch: 'full' },
  { path: 'area-search', component: AreaSearchComponent },
  { path: 'area-draw', component: AreaDrawComponent },
  { path: '**', component: NotFoundComponent }
  // </Production routing:>
  // <Developing routing:>
  // { path: 'login', component: LoginComponent },
  // { path: 'new-message', component: SendMessageComponent },
  // { path: 'message-details/:messageId', component: MessageDetailsComponent },
  // { path: 'reset-password', component: ResetPasswordComponent },
  // { path: 'change-password', component: ChangePasswordComponent },
  // { path: 'messages', component: ShowMessageComponent },
  // { path: 'distribution-list', component: DistributionListComponent },
  // { path: 'distribution-list-users/:id', component: DistributionListUsersComponent },
  // { path: '', redirectTo: '/messages', pathMatch: 'full' },
  // { path: '**', component: NotFoundComponent }
  // </Developing routing:>
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

