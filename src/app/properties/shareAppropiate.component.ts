import {Component, OnInit, Inject} from '@angular/core';
import {MD_DIALOG_DATA} from '@angular/material';
import {MdDialogRef} from '@angular/material';

import 'rxjs/add/operator/startWith';

import {PropertiesService} from '../services/properties.service';
import {OwnersService} from '../services/owners.service';
import {ConsultantsService} from '../services/consultants.service';
import {AuthService} from "../services/auth.service";
import {Property} from "../services/property";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {IntegrationsService} from "../services/integrations.service";

@Component({
    /*    templateUrl: 'src/app/properties/shareAppropiate.component.html',
     styleUrls: ['src/app/properties/shareAppropiate.component.scss'],*/
    templateUrl: 'shareAppropiate.component.html',
    styleUrls: ['shareAppropiate.component.scss'],
    providers: [PropertiesService, OwnersService, ConsultantsService, AuthService, IntegrationsService]
})
export class ShareAppropiateComponent implements OnInit {

    userId: any;
    item: Property;
    integration: string;
    active: any;

    shareForm: FormGroup;
    idNeighborhood: FormControl;

    activateForm: FormGroup;

    reactiveNeighborhoods: any;

    neighborhood_list = [{id: 1, nombre: 'Cargando...'}];

    dataLoaded = false;

    showError: any;
    error: any;

    addBarrio: any;
    addingBarrio: any;

    constructor(private _integrationsService: IntegrationsService,
                public dialogRef: MdDialogRef<ShareAppropiateComponent>,
                @Inject(MD_DIALOG_DATA) public data: any) {

        this.idNeighborhood = new FormControl('', [Validators.required]);
        this.reactiveNeighborhoods = this.idNeighborhood.valueChanges
            .startWith(this.idNeighborhood.value)
            .map(val => this.displayFn(val))
            .map(name => this.filterBarriosAutocomplete(name, this.neighborhood_list));

    }

    ngOnInit() {

        this.userId = localStorage.getItem('userId');
        this.item = this.data.item;
        this.integration = this.data.integration;
        this.active = this.data.active;

        console.log(this.item);

        this.shareForm = new FormGroup({
            'neighborhood': this.idNeighborhood
        });

        this.activateForm = new FormGroup({
            'user': new FormControl('', [Validators.required]),
            'password': new FormControl('', [Validators.required]),
        });

        this.shareForm.controls['neighborhood'].valueChanges.debounceTime(1000).subscribe(
            () => {
                if (this.shareForm.controls['neighborhood'].value) {
                    this.addBarrio = true;
                    this.addingBarrio = false;
                } else {
                    this.addBarrio = false;
                    this.addingBarrio = false;
                }
            }
        );

        if (this.active) {
            this.loadNeighborhoods();
        } else {
            this.dataLoaded = true;
        }


    }

    displayFn(value: any): string {
        return value && typeof value === 'object' ? value.nombre : value;
    }

    filterBarriosAutocomplete(val: string, list: any) {
        if (val) {
            // val = val.replace(/[^a-z\d\s\/\-]+/gi, '');
            val = val.replace(/[^a-z\d\s\u00C0-\u017F]+/gi, '');

        }
        if (val && list.filter((s) => s.nombre.match(new RegExp(val, 'gi'))).length == 1) {
            this.addBarrio = true;
        }
        else {
            this.addBarrio = false;
        }
        return val ? list.filter((s) => s.nombre.match(new RegExp(val, 'gi'))) : list;
    }

    activateIntegration(value: any) {
        if (this.activateForm.invalid || this.activateForm.untouched) {
            Object.keys(this.activateForm.controls).forEach(key => {
                this.activateForm.get(key).markAsDirty();
                this.activateForm.updateValueAndValidity();
            });
        } else {

            this.dataLoaded = false;

            let data = {
                username: value.user,
                password: value.password
            };

            this._integrationsService.activateIntegration(data)
                .subscribe(
                    response => {
                        if (response.statusCode == 200) {

                            this._integrationsService.getIntegrations()
                                .subscribe(
                                    integrationsRes => {
                                        this.showError = false;
                                        localStorage.setItem('integrations', JSON.stringify(integrationsRes));

                                        let data = {
                                            id: this.item.id,
                                            externalSystemCode: 'APPROPIATE'
                                        };
                                        this._integrationsService.shareAppropiate(data)
                                            .subscribe(
                                                response => {
                                                    if (response.error) {
                                                        this.loadNeighborhoods();
                                                        this.active = true;
                                                    } else {
                                                        this.dataLoaded = true;
                                                        this.dialogRef.close(response);
                                                    }
                                                },
                                                error => console.log(error)
                                            );

                                    },
                                    error => console.log(error)
                                );

                        } else {
                            this.dataLoaded = true;
                            this.showError = true;
                            this.error = "Usuario o contraseña incorrectos.";
                        }
                    },
                    error => console.log(error)
                );

        }

    }

    loadNeighborhoods() {
        var data = {
            externalSystemCode: 'APPROPIATE',
            internalObjectName: 'SECTOR',
            internalObjectCode: this.item.sector
        };
        this._integrationsService.getMappedObject(data)
            .subscribe(
                response => {
                    if (response.length == 0) {

                        var data = {
                            externalSystemCode: 'APPROPIATE',
                            internalObjectName: 'LOCATION',
                            internalObjectCode: this.item.location
                        };
                        this._integrationsService.getMappedObject(data)
                            .subscribe(
                                response => {

                                    this._integrationsService.getNeighborhoods(response.external_object_code)
                                        .subscribe(
                                            response => {
                                                this.dataLoaded = true;
                                                this._integrationsService.neighborhood_list = response.response;
                                                this.neighborhood_list = this._integrationsService.neighborhood_list;
                                                this.reactiveNeighborhoods = this.idNeighborhood.valueChanges
                                                    .startWith(this.idNeighborhood.value)
                                                    .map(val => this.displayFn(val))
                                                    .map(name => this.filterBarriosAutocomplete(name, this.neighborhood_list));
                                            },
                                            error => console.log(error),
                                        );

                                },
                                error => console.log(error),
                            );
                    }
                },
                error => console.log(error),
            );
    }

    shareAppropiate() {

        if (this.shareForm.invalid || this.shareForm.untouched) {
            Object.keys(this.shareForm.controls).forEach(key => {
                this.shareForm.get(key).markAsDirty();
                this.shareForm.updateValueAndValidity();
            });
        } else {

            this.dataLoaded = false;

            let data = {
                id: this.item.id,
                externalSystemCode: 'APPROPIATE'
            };

            this._integrationsService.shareAppropiate(data)
                .subscribe(
                    response => {
                        if (response.error) {
                            this.dialogRef.close(response);
                        } else {
                            this.dialogRef.close(response);
                        }

                    },
                    error => console.log(error)
                );
        }

    }

    mapObject() {
        this.addingBarrio = true;
        let data = {
            external_system_code: 'APPROPIATE',
            internal_object_name: 'SECTOR',
            external_object_name: 'BARRIO',
            internal_object_code: this.item.sector,
            external_object_code: this.shareForm.controls['neighborhood'].value.id
        };
        this._integrationsService.mapObject(data)
            .subscribe(
                response => {
                    this.addingBarrio = false;
                    this.addBarrio = false;
                },
                error => console.log(error)
            );
    }
}
