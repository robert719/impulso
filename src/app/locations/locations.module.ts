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
    MdSidenavModule} from '@angular/material';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {ConfirmComponent, SectorCreatorComponent} from './locations.component';

import { LocationsComponent } from './locations.component';
import { LocationsRoutes } from './locations.routing';

import 'hammerjs';

import { LocationsService } from '../services/locations.service';
import {SectorsService} from "../services/sectors.service";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(LocationsRoutes),
        FlexLayoutModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
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
        MaterialModule,
        MdNativeDateModule,
        MdSelectionModule,
    ],
    providers: [
        {provide: OverlayContainer, useClass: FullscreenOverlayContainer}, LocationsService, SectorsService
    ],
    declarations: [
        LocationsComponent,
        SectorCreatorComponent,
        ConfirmComponent
    ],
    entryComponents: [ SectorCreatorComponent, ConfirmComponent ],
})

export class LocationsModule {}
