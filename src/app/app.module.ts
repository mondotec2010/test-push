import { NgModule, LOCALE_ID } from '@angular/core';


import { AppComponent } from './component/app.component';
import { LoginComponent } from './component/login/login.component';
import { AuthGuard } from './injectable/auth/auth.guard';
import { AuthService } from './injectable/auth/auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './injectable/auth/auth.interceptor';

import { MessageService } from './injectable/message.service';
import { ShowMessageComponent } from './component/show-message/show-message.component';
import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/it';
import { SafePipe } from './safe.pipe';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { SharedModule } from 'src/app/shared.module';
import { DialogComponent } from './shared/components/dialog/dialog.component';
import { DetailMapComponent } from './component/show-message/detail-map/detail-map.component';
import { DistributionListComponent } from './component/distribution-list/distribution-list.component';
import { DetailMapV2Component } from './component/show-message/detail-map-v2/detail-map-v2.component';
import { MapDrawingRadiusToolComponent } from './component/map-drawing-radius-tool/map-drawing-radius-tool.component';
import { DetailMapByradiusComponent } from './component/show-message/detail-map-byradius/detail-map-byradius.component';

//Angular Material Components
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { NewMessageComponent } from './component/show-message/new-message/new-message.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { MatPaginatorIntlCro } from './component/show-message/customPaginatorIntl';
import { SuccessMessageSendingComponent } from './component/success-message-sending/success-message-sending.component';
import { FailedMessageSendingComponent } from './component/failed-message-sending/failed-message-sending.component';
import { BadCredentialsComponent } from './component/bad-credentials/bad-credentials.component';
import { TerminateResultDialogComponent } from './component/terminate-result-dialog/terminate-result-dialog.component';
import { RefreshComponent } from './component/refresh/refresh.component';
import { TerminateMessageDialogComponent } from './component/terminate-message-dialog/terminate-message-dialog.component';
import { SuccessTerminatingSnackComponent } from './success-terminating-snack/success-terminating-snack.component';
import { FailTerminatingSnackComponent } from './fail-terminating-snack/fail-terminating-snack.component';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { ExtendMessageDialogComponent } from './component/extend-message-dialog/extend-message-dialog.component';
import { ConnectionInterruptedComponent } from './component/connection-interrupted/connection-interrupted.component';
import { NewListComponent } from './component/new-list/new-list.component';
import { ClickStopPropagationDirective } from './click-stop-propagation.directive';
import { DeleteListComponent } from './component/delete-list/delete-list.component';
import { AreaSearchComponent } from './component/area-search/area-search.component';
import { EditListComponent } from './component/edit-list/edit-list.component';
import { TruncatePipe } from './component/show-message/new-message/truncate-pipe';
import { SendersComponent } from './component/senders/senders.component';
import { MenuComponent } from './component/menu/menu.component';
import { AreaDrawComponent } from './component/area-draw/area-draw.component';

import { AreasFactoryComponent } from './component/show-message/new-message/areas-factory/areas-factory.component';
import { DialogSentMessageComponent } from './shared/components/dialog/dialog-sent-message/dialog-sent-message.component';
import { DialogSentMessageErrorComponent } from './shared/components/dialog/dialog-sent-message-error/dialog-sent-message-error.component';
import { DialogResponseFileUploadComponent } from './shared/components/dialog/dialog-response-file-upload/dialog-response-file-upload.component';
import { DialogGenericErrorMessageComponent } from './shared/components/dialog/dialog-generic-error-message/dialog-generic-error-message.component';
import { DialogGenericErrorResponseComponent } from './shared/components/dialog/dialog-generic-error-response/dialog-generic-error-response.component';

registerLocaleData(locale);

@NgModule({
  declarations: [
    TruncatePipe,
    AppComponent,
    LoginComponent,
    ShowMessageComponent,
    SafePipe,
    ResetPasswordComponent,
    ChangePasswordComponent,
    NotFoundComponent,
    DialogComponent,
    DetailMapComponent,
    DistributionListComponent,
    DetailMapV2Component,
    MapDrawingRadiusToolComponent,
    DetailMapByradiusComponent,
    NewMessageComponent,
    SuccessMessageSendingComponent,
    FailedMessageSendingComponent,
    BadCredentialsComponent,
    TerminateResultDialogComponent,
    RefreshComponent,
    TerminateMessageDialogComponent,
    SuccessTerminatingSnackComponent,
    FailTerminatingSnackComponent,
    ExtendMessageDialogComponent,
    ConnectionInterruptedComponent,
    NewListComponent,
    ClickStopPropagationDirective,
    DeleteListComponent,
    AreaSearchComponent,
    EditListComponent,
    SendersComponent,
    MenuComponent,
    AreaDrawComponent,
    AreasFactoryComponent,
    DialogResponseFileUploadComponent,
    DialogSentMessageComponent,
    DialogSentMessageErrorComponent,
    DialogGenericErrorMessageComponent,
    DialogGenericErrorResponseComponent
  ],

  imports: [
    SharedModule,
    FlexLayoutModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgbModule,
    NgxMaterialTimepickerModule.setLocale('it-IT'),
    MaterialFileInputModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule

  ],

  entryComponents: [
    DialogComponent,
    DialogResponseFileUploadComponent,
    DialogSentMessageComponent,
    DialogSentMessageErrorComponent,
    DialogGenericErrorMessageComponent,
    DialogGenericErrorResponseComponent
  ],

  providers: [
    AuthGuard,
    AuthService,
    MatDatepickerModule,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro },
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: LOCALE_ID, useValue: 'it' },
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'it' },
  ],

  bootstrap: [AppComponent]

})
export class AppModule { }

