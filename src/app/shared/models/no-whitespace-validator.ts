import { AbstractControl, FormControl } from '@angular/forms';
export function noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
// import { AbstractControl, ValidationErrors } from '@angular/forms';

// export class UsernameValidator {
    
//     static cannotContainSpace(control: AbstractControl) : ValidationErrors | null {
//         if((control.value as string).indexOf(' ') >= 0){

//             return {cannotContainSpace: true}
//         }
  
//         return null;
//     }
// }