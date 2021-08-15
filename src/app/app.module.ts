import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConnexionComponent } from './connexion/connexion.component';
import { VisualisationComponent } from './Facture/visualisation/visualisation.component';
import { AjouterComponent } from './Facture/ajouter/ajouter.component';
import { ListeFacturesComponent } from './Facture/visualisation/liste-factures/liste-factures.component';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePickerComponent } from './Facture/visualisation/date-picker/date-picker.component';
import { GraphLigneComponent } from './Facture/visualisation/graph-ligne/graph-ligne.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RecherchePipe } from './recherche.pipe';
import { ChartsModule } from 'ng2-charts';
import { RecherchecPipe } from './recherchec.pipe';
import { RecherchescPipe } from './recherchesc.pipe';
import { UtilisateursComponent } from './Parametres/utilisateurs/utilisateurs.component';
import { VisualisationCongesComponent } from './Conges/visualisation-conges/visualisation-conges.component';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatCardAvatar, MatCardModule} from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { TabComponent } from './Facture/visualisation/tab/tab.component';
import { MatTableModule } from '@angular/material/table';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatBadgeModule} from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import {MatCalendar, MatDatepickerInput} from '@angular/material/datepicker';
import {MatTabGroup, MatTabsModule} from '@angular/material/tabs';
import {MatCheckbox, MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
// --------------------------------------------------------------------------------------------------

import { TableUtilisateursComponent} from './Parametres/utilisateurs/table-utilisateurs/table-utilisateurs.component';

import { CongesEnAttenteComponent } from './Conges/conges-en-attente/conges-en-attente.component';
import { TableCongesComponent } from './Conges/visualisation-conges/table-conges/table-conges.component';
import {MatSliderModule} from '@angular/material/slider';
import { TableCongesEnAttenteComponent} from './Conges/conges-en-attente/table-conges-en-attente/table-conges-en-attente.component';
import { CompteRenduVueComponent } from './Cra/compte rendu activite/compte-rendu-vue/compte-rendu-vue.component';
import {CraService} from './services/cra.service';
import { CompteRenduComponent } from './Cra/compte rendu activite/compte-rendu/compte-rendu.component';

import { CompteRenduActiviteComponent } from './Cra/compte rendu activite/compte-rendu-activite/compte-rendu-activite.component';
import {UserService} from './services/user.service';
import { AdministrationCraComponent } from './Cra/administration/administration-cra/administration-cra.component';
import { AdministrationProjetComponent } from './Cra/administration/projet/administration-projet/administration-projet.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { AddProjetComponent} from './Cra/administration/projet/add-projet/add-projet.component';
import { AddCommandeComponent } from './Cra/administration/projet/add-commande/add-commande.component';
import {ProjetService} from './services/projet.service';
import {CommandeService} from './services/commande.service';
import { CalendarMounthComponent } from './Cra/calendar-mounth/calendar-mounth.component';
import {CalendarModule, CalendarMonthModule, DateAdapter} from 'angular-calendar';
import {RouterModule} from '@angular/router';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import { TableCraEnAttenteComponent } from './Cra/administration/administration-cra/table-cra-en-attente/table-cra-en-attente.component';
import {CraWaitingService} from './services/craWaiting.service';
import {CalendarService} from './services/calendar.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { StatCongesComponent } from './Conges/visualisation-conges/stat-conges/stat-conges.component';

import {DialogContent} from './Cra/administration/administration-cra/table-cra-en-attente/table-cra-en-attente.component';
import {ConnexionService} from './connexion/connexion.service';
import {CustomPaginator} from './configuration-http/customPaginatorConfiguration';
import {ColorPickerModule} from 'ngx-color-picker';
import {MonCompteComponent} from './Parametres/mon-compte/mon-compte.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {FicheUtilisateurComponent} from './fiche-utilisateur/fiche-utilisateur.component';
import {FicheCongeComponent} from './fiche-conge/fiche-conge.component';
import { VisualisationProjetComComponent } from './Cra/administration/administration-cra/visualisation-projet-com/visualisation-projet-com.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {UpdateProjectComponent} from './Cra/administration/projet/update-project/update-project.component';
import { UpdateCommandeComponent } from './Cra/administration/projet/update-commande/update-commande.component';
import { DialogProjetComponent} from './Cra/administration/projet/update-project/dialog-projet/dialog-projet.component';
import { VisualisationProjetComponent } from './Cra/administration/projet/update-project/visualisation-projet/visualisation-projet.component';
import { ProjetPdfComponent } from './Cra/administration/projet/update-project/projet-pdf/projet-pdf.component';
import {ResponsableService} from './services/responsable.service';
import { UpdateClientResponsableComponent } from './Cra/administration/projet/update-client/update-client-responsable.component';
import {ClientService} from './services/client.service';
import { UpdateReponsableComponent } from './Cra/administration/projet/update-reponsable/update-reponsable.component';
import { PdfConteneurComponent } from './Cra/administration/projet/update-project/projet-pdf/pdf-conteneur/pdf-conteneur.component';
import { AideAjoutProjetComponent } from './Cra/aide-ajout-projet/aide-ajout-projet.component';
import { Slide1Component } from './Cra/aide-ajout-projet/slide1/slide1.component';
import { Slide2Component } from './Cra/aide-ajout-projet/slide2/slide2.component';
import { Slide3Component } from './Cra/aide-ajout-projet/slide3/slide3.component';
import { SlideRecapComponent } from './Cra/aide-ajout-projet/slide-recap/slide-recap.component';

registerLocaleData(localeFr);


@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    TableUtilisateursComponent,
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
    CompteRenduVueComponent,
    CompteRenduComponent,
    CompteRenduActiviteComponent,
    AdministrationCraComponent,
    AdministrationProjetComponent,
    AddProjetComponent,
    AddCommandeComponent,
    CalendarMounthComponent,
    TableCraEnAttenteComponent,
    DialogContent,
    MonCompteComponent,
    DashboardComponent,
    StatCongesComponent,
    FicheUtilisateurComponent,
    FicheCongeComponent,
    VisualisationProjetComComponent,
    UpdateProjectComponent,
    UpdateCommandeComponent,
    DialogProjetComponent,
    VisualisationProjetComponent,
    ProjetPdfComponent,
    UpdateClientResponsableComponent,
    UpdateReponsableComponent,
    PdfConteneurComponent,
    AideAjoutProjetComponent,
    Slide1Component,
    Slide2Component,
    Slide3Component,
    SlideRecapComponent
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
    MatExpansionModule,
    ColorPickerModule,
    CalendarMonthModule,
    CalendarModule,
    CalendarModule.forRoot({provide: DateAdapter, useFactory: adapterFactory}),
    MDBBootstrapModule.forRoot(),
    MDBBootstrapModule,
    MatDialogModule
  ],
  // providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  // tslint:disable-next-line:max-line-length
  providers: [ClientService, ResponsableService, CraService, UserService, ProjetService, CommandeService, CraWaitingService, CalendarService, ConnexionService, NavComponent , MatCardAvatar, {provide: MatPaginatorIntl, useValue: CustomPaginator()}],
  bootstrap: [AppComponent]
})

export class AppModule { }
