import {Injectable , EventEmitter} from '@angular/core';
import { Subscription } from "rxjs/internal/Subscription";

@Injectable({
    providedIn: 'root'
})

export class SolutionEmitterService{
    solutionEmitter = new EventEmitter();
    subsVar : Subscription;

    constructor(){}

    addSolution(val){
        
        this.solutionEmitter.emit(val)
    }
}