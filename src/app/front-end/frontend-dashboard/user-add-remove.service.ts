import {Injectable , EventEmitter} from '@angular/core';
import { Subscription } from "rxjs/internal/Subscription";

@Injectable({
    providedIn: 'root'
})

export class UserAddRemoveEmitterService{
    userRemoveEmitter = new EventEmitter();
    userAddEmitter = new EventEmitter();
    subsVar : Subscription;

    constructor(){}

    onUserRemove( parentIndex,index,userIndex){
        let value = {
            parentIndex:parentIndex,
            index : index,
            userIndex:userIndex
        }

        this.userRemoveEmitter.emit(value);
    }

    onUserAdd(val,parentIndex, index){
        let value = {
            value:val,
            index : index,
            parentIndex : parentIndex
        }

        this.userAddEmitter.emit(value);
    }
}