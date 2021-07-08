import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from '../entete/navbar/navbar.component';
import { BaspageComponent } from '../entete/baspage/baspage.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { VisualisationComponent } from './visualisation/visualisation.component';
import { AjouterComponent } from './ajouter/ajouter.component';
import { ListeFacturesComponent } from './visualisation/liste-factures/liste-factures.component';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePickerComponent } from './visualisation/date-picker/date-picker.component';
import { GraphLigneComponent } from './visualisation/graph-ligne/graph-ligne.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RecherchePipe } from './recherche.pipe';
import { ChartsModule } from 'ng2-charts';
import { RecherchecPipe } from './recherchec.pipe';
import { RecherchescPipe } from './recherchesc.pipe';
import { UtilisateursComponent } from './utilisateurs/utilisateurs.component';
import { VisualisationCongesComponent } from './visualisation-conges/visualisation-conges.component';
import { NavComponent } from './nav/nav.component';

//-------------------------------------------------------
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { TabComponent } from './visualisation/tab/tab.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatBadgeModule} from "@angular/material/badge";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import {MatCalendar, MatDatepickerInput} from "@angular/material/datepicker";
import {MatTabGroup, MatTabsModule} from "@angular/material/tabs";
import {MatCheckbox, MatCheckboxModule} from "@angular/material/checkbox";
import {MatDatepicker, MatDatepickerModule} from "@angular/material/datepicker";
//--------------------------------------------------------------------------------------------------
import { CongesEnAttenteComponent } from './conges-en-attente/conges-en-attente.component';
import { TableCongesComponent } from './visualisation-conges/table-conges/table-conges.component';
import {MatSliderModule} from "@angular/material/slider";
import { TableCongesEnAttenteComponent } from './conges-en-attente/table-conges-en-attente/table-conges-en-attente.component';

//import {HashLocationStrategy, LocationStrategy, PathLocationStrategy} from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    BaspageComponent,
    routingComponents,
    ListeFacturesComponent,
    DatePickerComponent,
    GraphLigneComponent,
    VisualisationComponent,
    ConnexionComponent,
    RecherchePipe,
    RecherchecPipe,
    RecherchescPipe,
    UtilisateursComponent,
    VisualisationCongesComponent,
    NavComponent,
    TabComponent,
    CongesEnAttenteComponent,
    TableCongesComponent,
    TableCongesEnAttenteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ChartsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatBadgeModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatTabsModule,
    MatCheckboxModule,
  ],
  //providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
