import { HttpHeaders } from "@angular/common/http";
import { FormGroup, FormControl, FormArray } from "@angular/forms";

export class Global {
  AlphaPattern: string = "^[a-z A-Z]*$";
  AlphaPatternWithSpace: string = "^[a-z A-Z]*$";
  AlphaNumericPattern: string =
    "^[a-zA-Z0-9\\/\\:\\_\\(\\)\\\\'\\\" ,\\-\\$%&\\|/#\\n]*$";
  NumericPattern: string = "^[0-9]*$";
  PhonePattern: string = "^[+][0-9]{1,3}\\-[0-9]*$";
  EmailPattern: string = "^[A-Za-z]+[A-Za-z0-9._]+@[A-Za-z]+[.][A-Za-z.]{2,5}$";
  fullname:string;

  getfullname(){
    return localStorage.getItem('fullname');
  }
  setfulname(fullName:string){
    localStorage.setItem("fullname", fullName);
  }
 
}

