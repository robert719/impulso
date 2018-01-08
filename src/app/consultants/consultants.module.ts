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
import {ConfirmComponent, ConsultantCreatorComponent} from './consultants.component';

import { ConsultantsComponent } from './consultants.component';
import { ConsultantsRoutes } from './consultants.routing';

import 'hammerjs';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ConsultantsRoutes),
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
        FlexLayoutModule,
        MaterialModule,
        MdNativeDateModule,
        MdSelectionModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        NgxDatatableModule
    ],
    providers: [
        {provide: OverlayContainer, useClass: FullscreenOverlayContainer}
    ],
    declarations: [
        ConsultantsComponent,
        ConsultantCreatorComponent,
        ConfirmComponent
    ],
    entryComponents: [ConsultantCreatorComponent, ConfirmComponent],
})

export class ConsultantsModule {}
