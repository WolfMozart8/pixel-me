import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ImageComponent } from './components/image/image.component';
import { FormsModule } from '@angular/forms';
import { PixelImageComponent } from './components/pixel-image/pixel-image.component';
import { ControlsComponent } from './components/controls/controls.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSliderModule } from "@angular/material/slider";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatRadioModule } from "@angular/material/radio";

@NgModule({
  declarations: [
    AppComponent,
    ImageComponent,
    PixelImageComponent,
    ControlsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSliderModule,
    MatButtonToggleModule,
    MatRadioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
