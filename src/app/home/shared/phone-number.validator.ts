import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export const phoneNumberValidator: ValidatorFn = ({ value }: AbstractControl): ValidationErrors =>
  isNaN(value) || value?.replace?.(/\D/, '')?.length > 11
    ? undefined
    : {
      phoneNumber: true
    } as ValidationErrors;
