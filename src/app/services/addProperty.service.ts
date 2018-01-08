import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class addPropertyService {
    showButton: EventEmitter<any> = new EventEmitter();
    propertyAdded: EventEmitter<boolean> = new EventEmitter();

    constructor() {}

    buttonValue(value) {
        this.showButton.emit(value);
    }

    getButtonValue() {
        return this.showButton;
    }

    addingProperty(value) {
        this.propertyAdded.emit(value);
    }

    addPropertyPromise() {
        return this.propertyAdded;
    }
}
