import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import {
  FullscreenOverlayContainer,
  MaterialModule,
  MdNativeDateModule,
  MdSelectionModule,
  OverlayContainer,
  MdCardModule,
  MdIconModule,
  MdTabsModule,
  MdInputModule,
  MdRadioModule,
  MdTooltipModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdListModule,
  MdSliderModule,
  MdCheckboxModule,
  MdProgressBarModule,
  MdToolbarModule,
  MdMenuModule,
  MdSidenavModule,
  MdExpansionModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { PropertyCreatorComponent } from './propertyCreator.component';
import { PropertyDetailDialogComponent } from './propertyDetailDialog.component';

import { PropertiesComponent } from './properties.component';
import { PropertiesRoutes } from './properties.routing';

import 'hammerjs';

import { LocationsService } from '../services/locations.service';
import { InternalCharsService } from '../services/internal-chars.service';
import { ExternalCharsService } from '../services/external-chars.service';
import { SectorCharsService } from '../services/sector-chars.service';
import { PropertiesService } from "../services/properties.service";
import { TypesService } from "../services/types.service";
import { PropertiesOnService } from "../services/propertiesOn.service";
import { OwnersService } from "../services/owners.service";
import { ConsultantsService } from "../services/consultants.service";
import { StatusesService } from "../services/statuses.service";
import { PublishService } from "../services/publish.service";
import { ImagesService } from "../services/images.service";
import { SectorsService } from "../services/sectors.service";
import { IntegrationsService } from "../services/integrations.service";
import { ShareAppropiateComponent } from "./shareAppropiate.component";
import { SharedModule } from "../shared/shared.module";
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ShareButtonsModule } from 'ngx-sharebuttons';
// import { ShareModule } from '@ngx-share/core';
import {ShareModule} from 'ng2share/share.module'
// import { FacebookModule } from 'ngx-facebook';
import { CeiboShare } from 'ng2-social-share';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PropertiesRoutes),
    MdCardModule,
    MdIconModule,
    MdInputModule,
    MdTooltipModule,
    MdRadioModule,
    MdButtonModule,
    MdProgressBarModule,
    MdToolbarModule,
    MdButtonToggleModule,
    MdListModule,
    MdSliderModule,
    MdCheckboxModule,
    MdMenuModule,
    MdTabsModule,
    MdSidenavModule,
    MdExpansionModule,
    ChartsModule,
    FlexLayoutModule,
    MaterialModule,
    MdNativeDateModule,
    MdSelectionModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ShareModule,
    ShareButtonsModule.forRoot(),

    // FacebookModule.forRoot(),
    
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyB3HQ_Gk_XRt6KitPdiHQNGpVn0NDwQGMI' }),
    SharedModule
  ],
  providers: [
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
    PropertiesService,
    TypesService,
    PropertiesOnService,
    OwnersService,
    ConsultantsService,
    StatusesService,
    PublishService,
    LocationsService,
    InternalCharsService,
    ExternalCharsService,
    SectorCharsService,
    SectorsService,
    ImagesService,
    IntegrationsService
  ],
  declarations: [
    PropertiesComponent,
    PropertyCreatorComponent,
    PropertyDetailDialogComponent,
    ShareAppropiateComponent,
    CeiboShare
  ],
  entryComponents: [PropertyCreatorComponent, PropertyDetailDialogComponent, ShareAppropiateComponent],
})

export class PropertiesModule { }
