import { Component, OnInit } from '@angular/core';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import 'moment/locale/ja';
import 'moment/locale/fr';
/*import {MomentDateAdapter} from "@angular/material-moment-adapter";

import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// @ts-ignore
import {default as _rollupMoment} from 'moment';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
*/

@Component({
  selector: 'app-visualisation-conges',
  templateUrl: './visualisation-conges.component.html',
  styleUrls: ['./visualisation-conges.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class VisualisationCongesComponent implements OnInit {
  congesCumules = 0;
  congesPoses = 0;
  congesRestant = 0;

  typePreccedent: any;

  //date = new FormControl(moment());
  minDate: Date;
  maxDate: Date;

  email = new FormControl('', [Validators.required, Validators.email]);

  formulaire = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
    typeConge: new FormControl(),
    dateDebutChoix: new FormControl(),
    dateFinChoix: new FormControl(),
    raisonConge: new FormControl(),
  });
  typesConges = [];

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  constructor(private _adapter: DateAdapter<any>,private modalService: NgbModal) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const day = new Date().getDate() + 8;
    this.minDate = new Date(year, month, day);
    this.maxDate = new Date(year + 1, 11, 31);

  }



  ngOnInit(): void {
    this._adapter.setLocale('fr');
  }

  changementEtatCongeExceptionnel(value: any) {

    if(value == 'URGENT'){
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const day = new Date().getDate();
      this.minDate = new Date(year, month, day);
      this.maxDate = new Date(year + 1, 11, 31);
    }
    if((value != 'URGENT') && (this.typePreccedent == 'URGENT')){
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const day = new Date().getDate() + 8;
      this.minDate = new Date(year, month, day);
      this.maxDate = new Date(year + 1,  11, 31);
      this.formulaire.get('end')?.reset();
      this.formulaire.get('start')?.reset();
    }
    this.typePreccedent = value;
    console.log(JSON.stringify(this.formulaire.value));
  }

  changement() {
    console.log(JSON.stringify(this.formulaire.value  ))
  }
}
