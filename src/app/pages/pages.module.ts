import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  MdIconModule,
  MdCardModule,
  MdInputModule,
  MdButtonModule,
  MdToolbarModule,
  MdTabsModule,
  MdListModule,
  MdSlideToggleModule,
  MdSelectModule,
  MdProgressBarModule,
  MdDialogModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { PagesRoutes } from './pages.routing';
import { BlankComponent } from './blank/blank.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { TimelineComponent } from './timeline/timeline.component';
import { EditComponent } from './edit/edit.component';
import { PricingComponent } from './pricing/pricing.component';
import {ConfirmComponent} from "../shared/confirm.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PagesRoutes),
    MdIconModule,
    MdCardModule,
    MdInputModule,
    MdButtonModule,
    MdToolbarModule,
    MdTabsModule,
    MdListModule,
    MdSlideToggleModule,
    MdProgressBarModule,
    MdSelectModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    MdDialogModule
  ],
  declarations: [
    BlankComponent,
    InvoiceComponent,
    TimelineComponent,
    EditComponent,
    PricingComponent
  ]
})

export class PagesModule {}
