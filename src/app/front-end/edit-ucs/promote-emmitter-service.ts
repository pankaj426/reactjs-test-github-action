import {Injectable , EventEmitter} from '@angular/core';
import { Subscription } from "rxjs/internal/Subscription";

@Injectable({
    providedIn: 'root'
})

export class PromoteEmitterService{
    promoteEmitter = new EventEmitter();
    subsVar : Subscription;

    constructor(){}

    onStopPromoting(val,id){
        let value = {
            val:val,
            id:id
        }
        this.promoteEmitter.emit(value);
    }
}