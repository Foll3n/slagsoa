// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { HttpHeaders} from '@angular/common/http';
import {FormGroup} from "@angular/forms";

export const environment = {
  minWidth: 1200,
  production: true,
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
  urlLogCra : 'http://5.196.8.160:4000/gateway/APICraLog/1.0/log'
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
