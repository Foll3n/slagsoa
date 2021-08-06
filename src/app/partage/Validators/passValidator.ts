// import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from "@angular/forms";
// import {Directive} from "@angular/core";
//
// export const PassValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
//   const mdp = control.get('mdp');
//   const mdp1 = control.get('confirmerMdp')
//   console.log(mdp, mdp1);
//   return mdp && mdp1 && mdp.value === mdp1.value ? { passValid: true } : null;
// };
//
// @Directive({
//   selector: '[appPassValidator]',
//   providers: [{ provide: NG_VALIDATORS, useExisting: PassValidatorDirective, multi: true }]
// })
// export class PassValidatorDirective implements Validator {
//   validate(control: AbstractControl): ValidationErrors | null {
//     return PassValidator(control);
//   }
// }
