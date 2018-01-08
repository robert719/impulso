import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions } from '@angular/http';

import { AppComponent } from './app.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AppRoutes } from './app.routing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import {
  MdInputModule,
  MdTooltipModule,
  MdRadioModule,
  MdProgressBarModule,
  MdButtonToggleModule,
  MdSliderModule,
  MdExpansionModule,
  MdSidenavModule,
  MdCardModule,
  MdMenuModule,
  MdCheckboxModule,
  MdIconModule,
  MdButtonModule,
  MdToolbarModule,
  MdTabsModule,
  MdListModule,
  MdSlideToggleModule,
  MdSelectModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedModule } from './shared/shared.module';
import { AuthService } from './services/auth.service';
import { AppGuard } from './services/app.guard';

import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { GlobalsService } from './services/globals.service';
import { addPropertyService } from './services/addProperty.service';
import { ConfirmComponent } from "./shared/confirm.component";
import { ConfigService } from "./services/config.service";




export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    ConfirmComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes, { useHash: true }),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    MdInputModule,
    MdTooltipModule,
    MdRadioModule,
    MdProgressBarModule,
    MdButtonToggleModule,
    MdSliderModule,
    MdExpansionModule,
    MdSidenavModule,
    MdCardModule,
    MdMenuModule,
    MdCheckboxModule,
    MdIconModule,
    MdButtonModule,
    MdToolbarModule,
    MdTabsModule,
    MdListModule,
    MdSlideToggleModule,
    MdSelectModule,
    FlexLayoutModule,
  ],
  providers: [
    AuthService,
    AppGuard,
    GlobalsService,
    addPropertyService,
    ConfigService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ],
  entryComponents: [ConfirmComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
