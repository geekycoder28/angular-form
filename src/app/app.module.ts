import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';

import { PdfViewerModule } from 'ng2-pdf-viewer'; 
import { AppComponent } from './app.component'; 
import { HttpClientModule } from '@angular/common/http'
import { ApiService } from './api.service';
 
@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        ReactiveFormsModule,
        BrowserModule,
        PdfViewerModule,
        MatButtonModule,
        HttpClientModule 
    ],
    providers: [ApiService],
    bootstrap: [AppComponent]
})
export class AppModule { }
