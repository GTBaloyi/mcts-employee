import {FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";


export const passwordMatchValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
    if(formGroup.get('password') != null && formGroup.get('confirmPassword') != null) {

        if (formGroup.get('password').value === formGroup.get('confirmPassword').value)
            return null;
        else
            return {passwordMismatch: true};
    }
};

export const passwordContainsLowercase: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
    if(formGroup.get('password') != null){
        if (!!formGroup.get('password').value.match(/[a-z]/))
            return null;
        else
            return {passwordNoLowercase: true};
    }
};

export const passwordUppercaseValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
    if(formGroup.get('password') != null) {
        if (!!formGroup.get('password').value.match(/[A-Z]/))
            return null;
        else
            return {passwordNoUppercase: true};
    }
};

export const passwordContainsNumbers: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {

    if(formGroup.get('password') != null) {

        if (!!formGroup.get('password').value.match(/^[^\d]+$/))
            return null;
        else
            return {passwordNoNumbers: true};

    }
};


export const passwordStrong: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
    if(formGroup.get('password') != null) {

        if (formGroup.get('password').value === 'Passw0rd' || formGroup.get('password').value === 'Password123')
            return null;
        else
            return {passwordIsStrong: true};
    }
};
