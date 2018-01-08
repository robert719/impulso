import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA} from '@angular/material';
import { FormGroup, Validators, FormControl} from '@angular/forms';

import 'rxjs/add/operator/startWith';

import {LocationsService} from '../services/locations.service';
import {addPropertyService} from '../services/addProperty.service';
import {CustomValidators} from "ng2-validation";
import {Location} from "../services/location";
import {Sector} from "../services/sector";
import {SectorsService} from "../services/sectors.service";

@Component({
    templateUrl: 'locations.component.html',
    styleUrls: ['locations.component.scss'],
    providers: [LocationsService]
})
export class LocationsComponent implements OnInit, OnDestroy {

    // Dialog para crear propiedades
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
    dialogRef: MdDialogRef<SectorCreatorComponent>;
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

    // ControlGroup para el formulario para ingresar, editar
    locationsForm: FormGroup;
    
    lastCloseResult: any;
    
    locationLoaded = false;

    userId: any;
    
    addingLocation = false;
    editingLocation = false;
    // Token para la información de la bd
    token: any;
    // Id del mlsId para verificar si el usuario pertenece a una mls
    mlsId: any;
    // Listado de downlines
    mls_downlines: any;

    locationsLoaded = false;
    
    locationsLoading = false;

    locationSelected: Location;

    addPropertySubscription: any;

    locationsFilter: FormGroup;

    sectorsFilter: FormGroup;

    locationsPage = 1;

    itemSelected: any;

    editingItem = false;

    // lista de ubicaciones que se muestran en el formulario de ingreso/edicion
    location_list: Location[] = [{id: 1, name: 'Cargando...'}];

    reactiveLocations: any;

    reactiveSectors: any;

    idLocationFilter: FormControl;
    idSectorFilter: FormControl;
    // lista de items que se muestran en la tabla principal
    sector_list: Sector[] = [];

    last_location_value: any;

    locationId: number;

    sectorsLoading = false;

    sectorsLoaded = false;

    loadingMore = false;

    loadMore = true;

    sectorsPage = 1;

    constructor(private _addPropertyService: addPropertyService,
                private _locationsService: LocationsService,
                private _sectorsService: SectorsService,
                public dialog: MdDialog) {

        this.addPropertySubscription = this._addPropertyService.addPropertyPromise()
            .subscribe(
                value => {
                    if (value) {
                        this.openSectorCreator(this.locationId);
                    }
                },
                error => console.log(error)
            );

        this._addPropertyService.buttonValue(false);

        // iniciar con el input de ubicaciones Cargando...
        this.idLocationFilter = new FormControl('');
        this.reactiveLocations = this.idLocationFilter.valueChanges
            .startWith(this.idLocationFilter.value)
            .map(val => this.displayLocation(val))
            .map(name => this.filterStates(name, this.location_list));
    }

    ngOnInit(): any {

        this.token = localStorage.getItem('token');
        this.userId = localStorage.getItem('userId');
        this.mlsId = localStorage.getItem('mlsId');

        // Defino la estructura del formulario de ingreso/edición.
        this.sectorsFilter = new FormGroup({
            'sector': new FormControl('', [])
        });

        this.locationsFilter = new FormGroup({
           'location': this.idLocationFilter
        });

        this._locationsService.getItems(this.locationsPage)
            .subscribe(
                response => {
                    // Actualizo el valor de la lista de propiedades en el servicio.
                    this._locationsService.location_list = response.data;
                    // Igualo el valor de la lista de propiedades local a la del servicio.
                    this.location_list = this._locationsService.location_list;
                    this.locationsLoaded = true;
                    this.locationsPage = response.current_page + 1;
                    this.reactiveLocations = this.idLocationFilter.valueChanges
                        .startWith(this.idLocationFilter.value)
                        .map(val => this.displayLocation(val))
                        .map(name => this.filterStates(name, this.location_list));
                },
                error => console.log(error)
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

    displayFn(value: any): string {
        return value && typeof value === 'object' ? value.name : value;
    }

    // Funcion para filtrar los valores en el autocomplete
    filterStates(val: string, list: any) {
        val = val.replace(/[^a-z\d\s]+/gi, '');
        return val ? list.filter((s) => s.name.match(new RegExp(val, 'gi'))) : list;
    }

    displayLocation(value: any): string {
        if (value && typeof value === 'object') {
            this.filterSectors(value);
        }
        return value && typeof value === 'object' ? value.name : value;
    }

    filterSectors(value: Location) {
        if (value && typeof  value === 'object' && this.last_location_value !== value) {
            this.last_location_value = value;
            this.sectorsLoading = true;
            this._sectorsService.getItemsFilteredBy(value.id)
                .subscribe(
                    res => {
                        if (res) {
                            this._sectorsService.sector_list = res.data;
                            this.sector_list = this._sectorsService.sector_list;
                            this.sectorsPage = res.current_page + 1;
                            if (res.to == res.total) {
                                this.loadMore = false;
                            } else {
                                this.loadMore = true;
                            }
                            this.locationId = value.id;
                            this.sectorsLoading = false;
                            this.sectorsLoaded = true;
                            this._addPropertyService.buttonValue(true);
                        }
                    },
                    error => console.log(error)
                );
        }
    }

    onSelect(item: Sector) {
        this.editingItem = true;
        this.itemSelected = item;
        // this._sectorsService.getIndexOfItem(this.itemSelected);
        this.openSectorCreator(item);
    }

    // Funcion para abrir el dialog para ingresar/editar propiedades
    openSectorCreator(item: any) {
        this.config.data = item;
        this.dialogRef = this.dialog.open(SectorCreatorComponent, this.config);
        this.dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.lastCloseResult = result;
                if (this.editingItem) {
                    this._sectorsService.sector_list[this._sectorsService.getIndexOfItem(this.itemSelected)] = result;
                    this.sector_list = this._sectorsService.sector_list;
                } else {
                    this._sectorsService.sector_list.unshift(this.lastCloseResult);
                    this.sector_list = this._sectorsService.sector_list;
                }
                this.itemSelected = null;
                this.editingItem = false;
            }
            this.dialogRef = null;
        });
    }

    onDelete(item: Sector) {
        const data = {
            title: '¿Está seguro que desea borrar este sector?',
            subtitle: 'Al borrar un sector no podrá recuperarlo.',
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
                this._sectorsService.deleteItem(item.id_sector).subscribe(
                    response => {
                        this._sectorsService.sector_list.splice(this._sectorsService.getIndexOfItem(item), 1);
                        this.confirmRef.close();
                    },
                    error => {
                        this.confirmRef.close();
                        const data = {
                            title: 'No se puede borrar este sector',
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

    loadSectors(value) {
        console.log(this.locationsFilter.value.location);

        this.sectorsLoading = true;
        this._sectorsService.getFilteredSectors(this.locationsFilter.value.location.id, value.sector)
            .subscribe(
                res => {
                    if (res) {
                        this._sectorsService.sector_list = res.data;
                        this.sector_list = this._sectorsService.sector_list;
                        this.locationId = value.id;
                        this.sectorsLoading = false;
                        this.sectorsLoaded = true;
                        this._addPropertyService.buttonValue(true);
                    }
                },
                error => console.log(error)
            );
    }

}


@Component({
    selector: 'app-jazz-dialog',
    templateUrl: 'sectorCreator.component.html',
    providers: [LocationsService]
})
export class SectorCreatorComponent implements OnInit {

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
    sectorsForm: FormGroup;

    userId: any;

    addingSector = false;
    editingSector = false;

    sectorSelected: Sector;

    sectorLoaded: any;

    constructor(private _sectorsService: SectorsService,
                public dialog: MdDialog,
                private dialogRef: MdDialogRef<SectorCreatorComponent>,
                @Inject(MD_DIALOG_DATA) public item: any) {
    }

    ngOnInit(): any {
        // Defino la estructura del formulario de ingreso/edición.
        this.sectorsForm = new FormGroup({
            'id': new FormControl('', []),
            'sector': new FormControl('', [Validators.required]),
        });

        this.userId = localStorage.getItem('userId');
        if (this.item && typeof this.item === 'object') {

            this.editingSector = true;

            this._sectorsService.getItem(this.item.id_sector)
                .subscribe(
                    response => {
                        if (response) {
                            this.sectorSelected = response;
                            this.sectorLoaded = true;
                        }
                    },
                    error => console.log(error)
                );
        } else {
            this.sectorLoaded = true;
            this.addingSector = true;
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

    addOrEditSector(value: Sector) {

        if (this.sectorsForm.invalid || this.sectorsForm.untouched) {
            Object.keys(this.sectorsForm.controls).forEach(key => {
                this.sectorsForm.get(key).markAsDirty();
                this.sectorsForm.updateValueAndValidity();
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
                const sector = {
                    id_location: this.sectorSelected.id,
                    id: null,
                    id_sector: this.item.id_sector,
                    sector: value.sector
                }
                this._sectorsService.updateItem(sector)
                    .subscribe(
                        res => {
                            let sectorAdded = {
                                id: res.id,
                                id_sector: res.id_sector,
                                id_location: res.id_location,
                                sector: value.sector
                            };
                            this.dialogRef.close(sectorAdded);
                            this.confirmRef.close();
                        },
                        error => console.log(error)
                    );
            } else {
                const sector = {
                    id_location: this.item,
                    name: value.sector
                }
                this._sectorsService.insertItem(sector)
                    .subscribe(
                        res => {
                            let sectorAdded = {
                                id: res.id,
                                id_sector: res.id_sector,
                                id_location: res.id_location,
                                sector: value.sector
                            };
                            this.dialogRef.close(sectorAdded);
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
