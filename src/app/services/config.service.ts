import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class ConfigService {
    /*showButton: EventEmitter<any> = new EventEmitter();*/
    changeConfig: EventEmitter<boolean> = new EventEmitter();

    constructor() {}

/*
    buttonValue(value) {
        this.showButton.emit(value);
    }

    getButtonValue() {
        return this.showButton;
    }
*/

    changingConfig(value) {
        this.changeConfig.emit(value);
    }

    changeConfigPromise() {
        return this.changeConfig;
    }
}
