import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA} from '@angular/material';
import { FormGroup, Validators, FormControl} from '@angular/forms';

import {Consultant} from '../services/consultant';

import 'rxjs/add/operator/startWith';

import {PropertiesService} from '../services/properties.service';
import {LocationsService} from '../services/locations.service';
import {TypesService} from '../services/types.service';
import {ConsultantsService} from '../services/consultants.service';
import {PropertiesOnService} from '../services/propertiesOn.service';

import {addPropertyService} from '../services/addProperty.service';
import {CustomValidators} from "ng2-validation";

@Component({
    selector: 'app-properties',
    templateUrl: 'consultants.component.html',
    styleUrls: ['consultants.component.scss'],
    providers: [ConsultantsService, PropertiesService, TypesService, LocationsService, PropertiesOnService]
})
export class ConsultantsComponent implements OnInit, OnDestroy {

    // Dialog para confirmar
    confirmRef: MdDialogRef<ConfirmComponent>;
    confirmConfig: MdDialogConfig = {
        disableClose: true,
        width: '80vw',
        height: '',
        position: {
            top: '',
            bottom: '',
            left: '',
            right: ''
        }
    };

    // *********************** VARIABLES INICIALES ************************************
    // ControlGroup para el formulario para ingresar, editar
    consultantsForm: FormGroup;
    // lista de propietarios que se muestran en el formulario de ingreso/edicion
    consultant_list: Consultant[] = [];
    token: any;
    // Id del usuario en la base de datos
    userId: any;
    // Id del mlsId para verificar si el usuario pertenece a una mls
    mlsId: any;
    // Listado de downlines
    mls_downlines: any;
    // Me suscribo a las acciones del servicio de agregar propiedad
    addPropertySubscription: any;

    // Dialog para crear propiedades
    dialogRef: MdDialogRef<ConsultantCreatorComponent>;
    lastCloseResult: any;
    config: MdDialogConfig = {
        disableClose: false,
        width: '80vw',
        height: '',
        position: {
            top: '',
            bottom: '',
            left: '',
            right: ''
        }
    };

    consultantsLoaded = false;
    consultantsLoading = false;

    // Todos los filtros del formulario de busqueda de propiedades.

    consultantsFilter: FormGroup;

    consultantsPage = 1;

    itemSelected: any;
    editingItem = false;

    loadMore = true;
    loadingMore = false;

    deletedBeforeLoadMore = 0;

    constructor(private _consultantsService: ConsultantsService,
                private _addPropertyService: addPropertyService,
                public dialog: MdDialog) {

        this.addPropertySubscription = this._addPropertyService.addPropertyPromise()
            .subscribe(
                value => {
                    if (value) {
                        this.openConsultantCreator(0);
                    }
                },
                error => console.log(error)
            );
    }

    ngOnInit(): any {

        this.token = localStorage.getItem('token');
        this.userId = localStorage.getItem('userId');
        this.mlsId = localStorage.getItem('mlsId');
        this.mls_downlines = localStorage.getItem('mls_downlines');

        // Defino la estructura del formulario de ingreso/edición.
        this.consultantsFilter = new FormGroup({
            'name': new FormControl('', []),
            'phone': new FormControl('', []),
            'email': new FormControl('', [])
        });

        this.reloadConsultants();

        this.consultantsFilter.valueChanges.debounceTime(1000).subscribe(
            () => {
                if (this.consultantsFilterActive()) {
                    this.filterConsultants(1);
                } else {
                    this.reloadConsultants();
                }
            }
        );
    }

    // Funcion para abrir el dialog para ingresar/editar propiedades
    openConfirmDialog(data: any) {
        this.confirmConfig.data = {loading: data.loading, ok: data.ok, cancel: data.cancel};
        this.confirmRef = this.dialog.open(ConfirmComponent, this.confirmConfig);
        this.confirmRef.afterClosed().subscribe(result => {
            this.lastCloseResult = result;
            this.dialogRef = null;
        });
    }

    ngOnDestroy(): any {
        this.addPropertySubscription.unsubscribe();
    }

    isOver(): boolean {
        return window.matchMedia(`(max-width: 960px)`).matches;
    }

    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }

    reloadConsultants() {
        this.deletedBeforeLoadMore = 0;
        this._consultantsService.getItems(1)
            .subscribe(
                response => {
                    // Actualizo el valor de la lista de propiedades en el servicio.
                    this._consultantsService.consultant_list = response.data;
                    // Igualo el valor de la lista de propiedades local a la del servicio.
                    this.consultant_list = this._consultantsService.consultant_list;
                    this.consultantsPage = response.current_page + 1;
                    if (response.to == response.total || response.data.length == 0) {
                        this.loadMore = false;
                    } else {
                        this.loadMore = true;
                    }
                    this.consultantsLoaded = true;
                    this.consultantsLoading = false;
                    this._addPropertyService.buttonValue(true);
                },
                error => console.log(error)
            );
    }

    cleanConsultantsFilter() {
        this.consultantsLoading = true;
        Object.keys(this.consultantsFilter.controls).forEach(key => {
            this.consultantsFilter.get(key).reset();
        });
    }

    // Funcion para abrir el dialog para ingresar/editar propiedades
    openConsultantCreator(item: any) {
        this.config.data = item;
        this.dialogRef = this.dialog.open(ConsultantCreatorComponent, this.config);
        this.dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.lastCloseResult = result;
                if (this.editingItem) {
                    this._consultantsService.consultant_list[this._consultantsService.getIndexOfItem(this.itemSelected)] = result;
                    this.consultant_list = this._consultantsService.consultant_list;
                } else {
                    console.log('se agrego');
                    this._consultantsService.consultant_list.unshift(this.lastCloseResult);
                    this.consultant_list = this._consultantsService.consultant_list;
                }
                this.itemSelected = null;
                this.editingItem = false;
            }
            this.dialogRef = null;
        });
    }

    onDelete(item: Consultant) {
        const data = {
            title: '¿Está seguro que desea borrar este asesor?',
            subtitle: 'Al borrar un asesor no podrá recuperarlo.',
            ok: true,
            cancel: true
        };

        this.confirmConfig.data = data;
        this.confirmRef = this.dialog.open(ConfirmComponent, this.confirmConfig);
        this.confirmRef.afterClosed().subscribe(result => {
            this.lastCloseResult = result;
            if (result === true) {
                const data2 = {
                    loading: true
                };
                this.openConfirmDialog(data2);
                this._consultantsService.deleteItem(item.id).subscribe(
                    response => {
                        this.deletedBeforeLoadMore = this.deletedBeforeLoadMore + 1;
                        this._consultantsService.consultant_list.splice(this._consultantsService.getIndexOfItem(item), 1);
                        this.confirmRef.close();
                    },
                    error => {
                        this.confirmRef.close();
                        const data = {
                            title: 'No se puede borrar este asesor',
                            subtitle: '',
                            ok: true,
                            cancel: false
                        };

                        this.confirmConfig.data = data;
                        this.confirmRef = this.dialog.open(ConfirmComponent, this.confirmConfig);
                        this.confirmRef.afterClosed().subscribe(result => {
                            this.confirmRef.close();
                        });
                    }
                );
                this.dialogRef = null;
            } else {
                this.dialogRef = null;
            }
        });

    }

    onSelect(item: Consultant) {
        this.editingItem = true;
        this.itemSelected = item;
        console.log('este es el itemSelected: ');
        console.log(this.itemSelected);
        this._consultantsService.getIndexOfItem(this.itemSelected);
        console.log(this.consultant_list.indexOf(this.itemSelected));
        this.openConsultantCreator(item);
    }

    filterConsultants(index: number) {
        this.loadingMore = true;
        const value = this.consultantsFilter.value;

        const attributes = {
            name: value.name ? value.name : undefined,
            phone: value.phone ? value.phone : undefined,
            email: value.email ? value.email : undefined
        };

        const gridState = {
            search: {
                predicateObject: attributes
            },
            sort: {
                predicate: [
                    {
                        predicate: "consultants.name",
                        reverse: false
                    }
                ]
            }
        };

        if (index == 1) {
            this.consultantsLoading = true;
        }

        if (this.deletedBeforeLoadMore > 0) {
            this._consultantsService.getItemsFilteredBy(gridState, index - 1)
                .subscribe(
                    response => {
                        let length = response.data.length - 1;
                        let from = length - this.deletedBeforeLoadMore;
                        for (var j = from; j < length; j++) {
                            this._consultantsService.consultant_list.push(response.data[j+1]);
                        }
                        this.consultant_list = this._consultantsService.consultant_list;

                        this._consultantsService.getItemsFilteredBy(gridState, index)
                            .subscribe(
                                response => {
                                    if (index == 1) {
                                        this._consultantsService.consultant_list = response.data;
                                        this.consultantsLoading = false;
                                    } else {
                                        Array.prototype.push.apply(this._consultantsService.consultant_list, response.data);
                                    }
                                    this.consultantsPage = response.current_page + 1;
                                    if (response.to == response.total || response.data.length == 0) {
                                        this.loadMore = false;
                                    } else {
                                        this.loadMore = true;
                                    }
                                    // Igualo el valor de la lista de propiedades local a la del servicio.
                                    this.consultant_list = this._consultantsService.consultant_list;
                                    this.deletedBeforeLoadMore = 0;
                                    this.loadingMore = false;
                                },
                                error => console.log(error)
                            );
                    },
                    error => console.log(error)
                );
        } else {

            this._consultantsService.getItemsFilteredBy(gridState, index)
                .subscribe(
                    response => {
                        if (index == 1) {
                            this._consultantsService.consultant_list = response.data;
                            this.consultantsLoading = false;
                        } else {
                            Array.prototype.push.apply(this._consultantsService.consultant_list, response.data);
                        }
                        this.consultantsPage = response.current_page + 1;
                        if (response.to == response.total || response.data.length == 0) {
                            this.loadMore = false;
                        } else {
                            this.loadMore = true;
                        }
                        // Igualo el valor de la lista de propiedades local a la del servicio.
                        this.consultant_list = this._consultantsService.consultant_list;
                        this.deletedBeforeLoadMore = 0;
                        this.loadingMore = false;
                    },
                    error => console.log(error)
                );
        }

    }

    consultantsFilterActive() {
        let count = 0;
        Object.keys(this.consultantsFilter.controls).forEach(key => {
            if (this.consultantsFilter.get(key).value) {
                count = count + 1;
            }
        });

        if (count > 0) {
            return true;
        } else {
            return false;
        }
    }

    loadConsultants() {
        this.loadingMore = true;
        let count = 0;
        Object.keys(this.consultantsFilter.controls).forEach(key => {
            if (this.consultantsFilter.get(key).value) {
                count = count + 1;
            }
        });
        if (count == 0) {

            if (this.deletedBeforeLoadMore > 0) {
                this._consultantsService.getItems(this.consultantsPage - 1)
                    .subscribe(
                        response => {
                            let length = response.data.length - 1;
                            let from = length - this.deletedBeforeLoadMore;
                            for (var j = from; j < length; j++) {
                                this._consultantsService.consultant_list.push(response.data[j+1]);
                            }
                            this.consultant_list = this._consultantsService.consultant_list;

                            this._consultantsService.getItems(this.consultantsPage)
                                .subscribe(
                                    response => {
                                        // Actualizo el valor de la lista de propiedades en el servicio.
                                        Array.prototype.push.apply(this._consultantsService.consultant_list, response.data);
                                        this.consultantsPage = response.current_page + 1;
                                        if (response.to == response.total) {
                                            this.loadMore = false;
                                        } else {
                                            this.loadMore = true;
                                        }
                                        // Igualo el valor de la lista de propiedades local a la del servicio.
                                        this.consultant_list = this._consultantsService.consultant_list;
                                        this.loadingMore = false;
                                    },
                                    error => console.log(error)
                                );
                        },
                        error => console.log(error)
                    );
            } else {
                this._consultantsService.getItems(this.consultantsPage)
                    .subscribe(
                        response => {
                            // Actualizo el valor de la lista de propiedades en el servicio.
                            Array.prototype.push.apply(this._consultantsService.consultant_list, response.data);
                            this.consultantsPage = response.current_page + 1;
                            if (response.to == response.total) {
                                this.loadMore = false;
                            } else {
                                this.loadMore = true;
                            }
                            // Igualo el valor de la lista de propiedades local a la del servicio.
                            this.consultant_list = this._consultantsService.consultant_list;
                            this.loadingMore = false;
                        },
                        error => console.log(error)
                    );
            }
        } else {
            this.filterConsultants(this.consultantsPage);
        }
    }

}


@Component({
    selector: 'app-jazz-dialog',
    templateUrl: 'consultantCreator.component.html',
    providers: [PropertiesService, ConsultantsService, ConsultantsService, LocationsService]
})
export class ConsultantCreatorComponent implements OnInit {

    // Dialog para crear propiedades
    confirmRef: MdDialogRef<ConfirmComponent>;
    confirmConfig: MdDialogConfig = {
        disableClose: true,
        width: '60vw',
        height: '',
        position: {
            top: '',
            bottom: '',
            left: '',
            right: ''
        }
    };

    lastCloseResult: any;

    // ControlGroup para el formulario para ingresar, editar
    consultantsForm: FormGroup;
    consultantLoaded = false;

    userId: any;

    addingConsultant = false;
    editingConsultant = false;

    consultantSelected: Consultant;

    constructor(private _consultantsService: ConsultantsService,
                public dialog: MdDialog,
                private dialogRef: MdDialogRef<ConsultantCreatorComponent>,
                @Inject(MD_DIALOG_DATA) public item: any) {
    }

    // Funcion para abrir el dialog para ingresar/editar propiedades
    openConfirmDialog(data: any) {
        this.confirmConfig.data = {loading: data.loading, ok: data.ok, cancel: data.cancel};
        this.confirmRef = this.dialog.open(ConfirmComponent, this.confirmConfig);
        this.confirmRef.afterClosed().subscribe(result => {
            this.lastCloseResult = result;
            this.dialogRef = null;
        });
    }

    ngOnInit(): any {
        // Defino la estructura del formulario de ingreso/edición.
        this.consultantsForm = new FormGroup({
            'id': new FormControl('', []),
            'name': new FormControl('', [Validators.required]),
            'phone': new FormControl('', []),
            'email': new FormControl('', [CustomValidators.email]),
        });

        this.userId = localStorage.getItem('userId');
        if (this.item && typeof this.item === 'object') {

            this.editingConsultant = true;

            this._consultantsService.getItem(this.item.id)
                .subscribe(
                    response => {
                        if (response) {
                            this.consultantSelected = response;
                            this.consultantLoaded = true;
                        }
                    },
                    error => console.log(error)
                );
        } else {
            this.consultantLoaded = true;
            this.addingConsultant = true;
        }

    }

    addEdit(value: Consultant) {

        if (this.consultantsForm.invalid || this.consultantsForm.untouched) {
            Object.keys(this.consultantsForm.controls).forEach(key => {
                this.consultantsForm.get(key).markAsDirty();
                this.consultantsForm.updateValueAndValidity();
            });
        } else {
            const data = {
                loading: true
            };

            this.openConfirmDialog(data);

            const position = {
                top: '-500',
                bottom: '',
                left: '',
                right: '-500'
            };
            this.dialogRef.updateSize('0', '0');
            this.dialogRef.updatePosition(position);

            if (this.item && typeof this.item === 'object') {

                this._consultantsService.updateItem(value)
                    .subscribe(
                        res => {
                            this.dialogRef.close(res);
                            this.confirmRef.close();
                        },
                        error => console.log(error)
                    );
            } else {
                this._consultantsService.insertItem(value)
                    .subscribe(
                        res => {
                            this.dialogRef.close(res);
                            this.confirmRef.close();
                        },
                        error => console.log(error)
                    );
            }
        }

    }

}

@Component({
    templateUrl: '../shared/confirm.component.html'
})
export class ConfirmComponent {

    constructor(public dialogRef: MdDialogRef<ConfirmComponent>,
                @Inject(MD_DIALOG_DATA) public data: any) {}

}
