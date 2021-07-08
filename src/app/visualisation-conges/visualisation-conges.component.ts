import { Component, OnInit } from '@angular/core';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, Validators} from '@angular/forms';
import {MomentDateAdapter} from "@angular/material-moment-adapter";
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
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};


@Component({
  selector: 'app-visualisation-conges',
  templateUrl: './visualisation-conges.component.html',
  styleUrls: ['./visualisation-conges.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
})
export class VisualisationCongesComponent implements OnInit {
  congesCumules = 0;
  congesPoses = 0;
  congesRestant = 0;


  date = new FormControl(moment());
  minDate: Date;
  maxDate: Date;

  email = new FormControl('', [Validators.required, Validators.email]);
  etatCongeExceptionnel= false;

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  constructor(private modalService: NgbModal) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const day = new Date().getDate() + 8;
    this.minDate = new Date(year, month, day);
    this.maxDate = new Date(year + 1, 11, 31);
  }



  ngOnInit(): void {
  }

  changementEtatCongeExceptionnel() {
    this.etatCongeExceptionnel = !this.etatCongeExceptionnel;
    if(this.etatCongeExceptionnel){
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const day = new Date().getDate();
      this.minDate = new Date(year, month, day);
      this.maxDate = new Date(year + 1, 11, 31);
    }
    else{
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const day = new Date().getDate() + 8;
      this.minDate = new Date(year, month, day);
      this.maxDate = new Date(year + 1, 11, 31);
    }
  }
}
