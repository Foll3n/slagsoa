// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { HttpHeaders} from '@angular/common/http';
import {FormGroup} from "@angular/forms";
import {Message} from '../app/Cra/models/message';

export const environment = {
  minWidth: 1200,
  production: true,
  urlClient: 'http://5.196.8.160:4000/gateway/APIClient/1.0/client',
  urlResponsable: 'http://5.196.8.160:4000/gateway/APIResponsable/1.0/responsable',
  urlFacture: 'http://5.196.8.160:4000/gateway/APIFacture/1.0/facture',
  urlCategories: 'http://5.196.8.160:4000/gateway/APICategorie/1.0/categorie',
  urlRole: 'http://5.196.8.160:4000/gateway/APIRole/1.0/role',
  urlGrade: 'http://5.196.8.160:4000/gateway/APIGrade/1.0/grade',
  urlUtilisateurs: 'http://5.196.8.160:4000/gateway/APIUtilisateur/1.0/utilisateur',
  urlConnexion: 'http://5.196.8.160:4000/gateway/APIConnexion/1.0/connexion',
  urlConges: 'http://5.196.8.160:4000/gateway/APIConges/1.0/conges',
  urlTypes: 'http://5.196.8.160:4000/gateway/APIType/1.0/type',
  urlEtat: 'http://5.196.8.160:4000/gateway/APIEtat/1.0/etat',
  urlCra: 'http://5.196.8.160:4000/gateway/APICra/1.0/cra',
  urlCr: 'http://5.196.8.160:4000/gateway/APICr/1.0/cr',
  urlCommande : 'http://5.196.8.160:4000/gateway/APICommande/1.0/commande',
  urlProjet: 'http://5.196.8.160:4000/gateway/APIProjet/1.0/projet',
  urlRealisation : 'http://5.196.8.160:4000/gateway/APIRealisation/1.0/realisation',
  urlCraWeek : 'http://5.196.8.160:4000/gateway/APICraWeek/1.0/craWeek',
  urlLogCra : 'http://5.196.8.160:4000/gateway/APICraLog/1.0/log',
  urlMail : 'http://5.196.8.160:4000/gateway/APIMail/1.0/mail/send',
  urlJoursFeries : 'http://5.196.8.160:4000/gateway/APIJoursReels/1.0/joursReels'
};

export function dateFormatter(date: string){
  const a = date.split('-');
  return (a[2] + '/' + a[1] + '/' + a[0]);
}
export function getWidth() {
  return window.innerWidth;
}
export function resetForm(form: FormGroup) {
  form.reset();
  Object.keys(form.controls).forEach(key => {
    form.get(key)!.setErrors(null) ;
  });
  form.clearValidators();
}
export function isDatesEqual(date1:Date, date2:Date) {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}
// tslint:disable-next-line:typedef
export function shortMessage(variable: Message, message: string){
  variable.contenu = message;
  setTimeout(() => {
    variable.contenu = '';
  }, 3000);
}
export function checkValidity(property: string, form: FormGroup){
  if(form.get(property)?.invalid)
    form.get(property)?.setValue('');

}
export function validateEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
export function hexToRGB(hex: string, alpha: string) {

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } else {
    return `rgb(${r}, ${g}, ${b})`;
  }
}
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
