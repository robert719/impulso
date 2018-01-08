import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA} from '@angular/material';
import { FormGroup, Validators, FormControl} from '@angular/forms';

import {Owner} from '../services/owner';

import 'rxjs/add/operator/startWith';

import {PropertiesService} from '../services/properties.service';
import {LocationsService} from '../services/locations.service';
import {TypesService} from '../services/types.service';
import {OwnersService} from '../services/owners.service';
import {ConsultantsService} from '../services/consultants.service';
import {PropertiesOnService} from '../services/propertiesOn.service';

import {addPropertyService} from '../services/addProperty.service';
import {CustomValidators} from "ng2-validation";

@Component({
    selector: 'app-properties',
    templateUrl: 'owners.component.html',
    styleUrls: ['owners.component.scss'],
    providers: [OwnersService, PropertiesService, TypesService, LocationsService, PropertiesOnService]
})
export class OwnersComponent implements OnInit, OnDestroy {

    // *********************** VARIABLES INICIALES ************************************
    // ControlGroup para el formulario para ingresar, editar
    ownersForm: FormGroup;
    // lista de propietarios que se muestran en el formulario de ingreso/edicion
    owner_list: Owner[] = [];
    token: any;
    // Id del usuario en la base de datos
    userId: any;
    // Id del mlsId para verificar si el usuario pertenece a una mls
    mlsId: any;
    // Listado de downlines
    mls_downlines: any;
    // Me suscribo a las acciones del servicio de agregar propiedad
    addPropertySubscription: any;

    lastCloseResult: any;

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

    // Dialog para crear propiedades
    dialogRef: MdDialogRef<OwnerCreatorComponent>;
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

    ownersLoaded = false;
    ownersLoading = false;

    ownersFilter: FormGroup;

    ownersPage = 1;

    itemSelected: any;
    editingItem = false;

    loadingMore = false;
    loadMore = true;

    deletedBeforeLoadMore = 0;

    constructor(private _ownersService: OwnersService,
                private _addPropertyService: addPropertyService,
                public dialog: MdDialog) {

        this.addPropertySubscription = this._addPropertyService.addPropertyPromise()
            .subscribe(
                value => {
                    if (value) {
                        this.openOwnerCreator(0);
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
        this.ownersFilter = new FormGroup({
            'name': new FormControl('', []),
            'email': new FormControl('', []),
            'document': new FormControl('', []),
            'phone': new FormControl('', [])
        });

        this.reloadOwners();

        this.ownersFilter.valueChanges.debounceTime(1000).subscribe(
            () => {
                if (this.ownersFilterActive()) {
                    this.filterOwners(1);
                } else {
                    this.reloadOwners();
                }
            }
        );

    }

    ngOnDestroy(): any {
        this.addPropertySubscription.unsubscribe();
    }

    openConfirmDialog(data: any) {
        this.confirmConfig.data = {loading: data.loading, ok: data.ok, cancel: data.cancel};
        this.confirmRef = this.dialog.open(ConfirmComponent, this.confirmConfig);
        this.confirmRef.afterClosed().subscribe(result => {
            this.lastCloseResult = result;
            this.dialogRef = null;
        });
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

    reloadOwners() {
        this.deletedBeforeLoadMore = 0;
        this._ownersService.getItems(1)
            .subscribe(
                response => {
                    // Actualizo el valor de la lista de propiedades en el servicio.
                    this._ownersService.owner_list = response.data;
                    // Igualo el valor de la lista de propiedades local a la del servicio.
                    this.owner_list = this._ownersService.owner_list;
                    this.ownersPage = response.current_page + 1;
                    if (response.to == response.total || response.data.length == 0) {
                        this.loadMore = false;
                    } else {
                        this.loadMore = true;
                    }
                    this.ownersLoaded = true;
                    this.ownersLoading = false;
                    this._addPropertyService.buttonValue(true);
                },
                error => console.log(error)
            );
    }

    cleanOwnersFilter() {
        this.ownersLoading = true;
        Object.keys(this.ownersFilter.controls).forEach(key => {
            this.ownersFilter.get(key).reset();
        });
    }

    ownersFilterActive() {
        let count = 0;
        Object.keys(this.ownersFilter.controls).forEach(key => {
            if (this.ownersFilter.get(key).value) {
                count = count + 1;
            }
        });

        if (count > 0) {
            return true;
        } else {
            return false;
        }
    }

    // Funcion para abrir el dialog para ingresar/editar propiedades
    openOwnerCreator(item: any) {
        this.config.data = item;
        this.dialogRef = this.dialog.open(OwnerCreatorComponent, this.config);
        this.dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.lastCloseResult = result;
                if (this.editingItem) {
                    this._ownersService.owner_list[this._ownersService.getIndexOfItem(this.itemSelected)] = result;
                    this.owner_list = this._ownersService.owner_list;
                } else {
                    console.log('se agrego');
                    this._ownersService.owner_list.unshift(this.lastCloseResult);
                    this.owner_list = this._ownersService.owner_list;
                }
                this.itemSelected = null;
                this.editingItem = false;
            }
            this.dialogRef = null;
        });
    }

    onDelete(item: Owner) {
        const data = {
            title: '¿Está seguro que desea borrar este propietario?',
            subtitle: 'Al borrar un propietario no podrá recuperarlo.',
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
                this._ownersService.deleteItem(item.id).subscribe(
                    response => {
                        this.deletedBeforeLoadMore = this.deletedBeforeLoadMore + 1;
                        this._ownersService.owner_list.splice(this._ownersService.getIndexOfItem(item), 1);
                        this.confirmRef.close();
                    },
                    error => {
                        this.confirmRef.close();
                        const data = {
                            title: 'No se puede borrar este propietario',
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

    onSelect(item: Owner) {
        this.editingItem = true;
        this.itemSelected = item;
        this._ownersService.getIndexOfItem(this.itemSelected);
        this.openOwnerCreator(item);
    }

    filterOwners(index: number) {
        this.loadingMore = true;
        const value = this.ownersFilter.value;

        const attributes = {
            name: value.name ? value.name : undefined,
            email: value.email ? value.email : undefined,
            document: value.document ? value.document : undefined,
            phone: value.phone ? value.phone : undefined
        };

        const gridState = {
            search: {
                predicateObject: attributes
            },
            sort: {
                predicate: [
                    {
                        predicate: "owners.name",
                        reverse: false
                    }
                ]
            }
        };

        if (index == 1) {
            this.ownersLoading = true;
        }

        if (this.deletedBeforeLoadMore > 0) {
            this._ownersService.getItemsFilteredBy(gridState, index - 1)
                .subscribe(
                    response => {
                        let length = response.data.length - 1;
                        let from = length - this.deletedBeforeLoadMore;
                        for (var j = from; j < length; j++) {
                            this._ownersService.owner_list.push(response.data[j+1]);
                        }
                        this.owner_list = this._ownersService.owner_list;

                        this._ownersService.getItemsFilteredBy(gridState, index)
                            .subscribe(
                                response => {
                                    if (index == 1) {
                                        this._ownersService.owner_list = response.data;
                                        this.ownersLoading = false;
                                    } else {
                                        Array.prototype.push.apply(this._ownersService.owner_list, response.data);
                                    }
                                    this.ownersPage = response.current_page + 1;
                                    if (response.to == response.total || response.data.length == 0) {
                                        this.loadMore = false;
                                    } else {
                                        this.loadMore = true;
                                    }
                                    // Igualo el valor de la lista de propiedades local a la del servicio.
                                    this.owner_list = this._ownersService.owner_list;
                                    this.deletedBeforeLoadMore = 0;
                                    this.loadingMore = false;
                                },
                                error => console.log(error)
                            );
                    },
                    error => console.log(error)
                );
        } else {

            this._ownersService.getItemsFilteredBy(gridState, index)
                .subscribe(
                    response => {
                        if (index == 1) {
                            this._ownersService.owner_list = response.data;
                            this.ownersLoading = false;
                        } else {
                            Array.prototype.push.apply(this._ownersService.owner_list, response.data);
                        }
                        this.ownersPage = response.current_page + 1;
                        if (response.to == response.total || response.data.length == 0) {
                            this.loadMore = false;
                        } else {
                            this.loadMore = true;
                        }
                        // Igualo el valor de la lista de propiedades local a la del servicio.
                        this.owner_list = this._ownersService.owner_list;
                        this.deletedBeforeLoadMore = 0;
                        this.loadingMore = false;
                    },
                    error => console.log(error)
                );
        }
    }

    loadOwners() {
        this.loadingMore = true;
        let count = 0;
        Object.keys(this.ownersFilter.controls).forEach(key => {
            if (this.ownersFilter.get(key).value) {
                count = count + 1;
            }
        });
        if (count == 0) {

            if (this.deletedBeforeLoadMore > 0) {
                this._ownersService.getItems(this.ownersPage - 1)
                    .subscribe(
                        response => {
                            let length = response.data.length - 1;
                            let from = length - this.deletedBeforeLoadMore;
                            for (var j = from; j < length; j++) {
                                this._ownersService.owner_list.push(response.data[j+1]);
                            }
                            this.owner_list = this._ownersService.owner_list;

                            this._ownersService.getItems(this.ownersPage)
                                .subscribe(
                                    response => {
                                        // Actualizo el valor de la lista de propiedades en el servicio.
                                        Array.prototype.push.apply(this._ownersService.owner_list, response.data);
                                        this.ownersPage = response.current_page + 1;
                                        if (response.to == response.total) {
                                            this.loadMore = false;
                                        } else {
                                            this.loadMore = true;
                                        }
                                        // Igualo el valor de la lista de propiedades local a la del servicio.
                                        this.owner_list = this._ownersService.owner_list;
                                        this.loadingMore = false;
                                    },
                                    error => console.log(error)
                                );
                        },
                        error => console.log(error)
                    );
            } else {
                this._ownersService.getItems(this.ownersPage)
                    .subscribe(
                        response => {
                            // Actualizo el valor de la lista de propiedades en el servicio.
                            Array.prototype.push.apply(this._ownersService.owner_list, response.data);
                            this.ownersPage = response.current_page + 1;
                            if (response.to == response.total) {
                                this.loadMore = false;
                            } else {
                                this.loadMore = true;
                            }
                            // Igualo el valor de la lista de propiedades local a la del servicio.
                            this.owner_list = this._ownersService.owner_list;
                            this.loadingMore = false;
                        },
                        error => console.log(error)
                    );
            }
        } else {
            this.filterOwners(this.ownersPage);
        }
    }
}


@Component({
    selector: 'app-jazz-dialog',
    templateUrl: 'ownerCreator.component.html',
    providers: [PropertiesService, OwnersService, ConsultantsService, LocationsService]
})
export class OwnerCreatorComponent implements OnInit {

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
    ownersForm: FormGroup;
    ownerLoaded = false;

    userId: any;

    addingOwner = false;
    editingOwner = false;

    ownerSelected: Owner;

    constructor(private _ownersService: OwnersService,
                public dialog: MdDialog,
                private dialogRef: MdDialogRef<OwnerCreatorComponent>,
                @Inject(MD_DIALOG_DATA) public item: any) {
    }

    ngOnInit(): any {
        // Defino la estructura del formulario de ingreso/edición.
        this.ownersForm = new FormGroup({
            'id': new FormControl('', []),
            'name': new FormControl('', [Validators.required]),
            'email': new FormControl('', [CustomValidators.email]),
            'document': new FormControl('', []),
            'phone1': new FormControl('', []),
            'phone2': new FormControl('', []),
            'date': new FormControl('', [])
        });

        this.userId = localStorage.getItem('userId');
        if (this.item && typeof this.item === 'object') {

            this.editingOwner = true;

            this._ownersService.getItem(this.item.id)
                .subscribe(
                    response => {
                        if (response) {
                            this.ownerSelected = response;
                            this.ownerLoaded = true;
                        }
                    },
                    error => console.log(error)
                );
        } else {
            this.ownerLoaded = true;
            this.addingOwner = true;
        }

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

    addEdit(value: Owner) {

        if (this.ownersForm.invalid || this.ownersForm.untouched) {
            Object.keys(this.ownersForm.controls).forEach(key => {
                this.ownersForm.get(key).markAsDirty();
                this.ownersForm.updateValueAndValidity();
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

                this._ownersService.updateItem(value)
                    .subscribe(
                        res => {
                            this.dialogRef.close(res);
                            this.confirmRef.close();
                        },
                        error => console.log(error)
                    );
            } else {
                this._ownersService.insertItem(value)
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
