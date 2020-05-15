import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { ExportJSONComponent } from './export-json/export-json.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent,
    ExportJSONComponent
  ]
})
export class HomeModule { }
