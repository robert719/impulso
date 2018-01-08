import {Component, Inject} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';

import 'rxjs/add/operator/startWith';

@Component({
    templateUrl: './confirm.component.html'
})
export class ConfirmComponent {

    constructor(public dialogRef: MdDialogRef<ConfirmComponent>,
                @Inject(MD_DIALOG_DATA) public data: any) {
    }

}
