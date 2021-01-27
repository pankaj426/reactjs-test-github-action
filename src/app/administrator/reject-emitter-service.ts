import {Injectable , EventEmitter} from '@angular/core';
import { Subscription } from "rxjs/internal/Subscription";

@Injectable({
    providedIn: 'root'
})

export class RejectEmitterService{
    startupEmitter = new EventEmitter();
    corporateEmitter = new EventEmitter();
    subsVarStartup : Subscription;
    subsVarCorporate :Subscription;
    constructor(){}

    onStartupReject(value){
        this.startupEmitter.emit(value);
    }

    onCorporateReject(value){
        this.corporateEmitter.emit(value);
    }
}