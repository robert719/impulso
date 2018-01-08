import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TooltipPosition } from '@angular/material';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';

import { Property } from '../services/property';
import { Type } from '../services/type';
import { InternalChar } from '../services/internal-char';
import { ExternalChar } from '../services/external-char';
import { SectorChar } from '../services/sector-char';
import { Status } from '../services/status';
import { Unit } from '../services/unit';
import { PropertyOn } from '../services/propertyOn';
import { Location } from '../services/location';
import { Consultant } from "../services/consultant";
import { Owner } from "../services/owner";

import 'rxjs/add/operator/startWith';

import { addPropertyService } from '../services/addProperty.service';

import { PropertiesService } from '../services/properties.service';
import { LocationsService } from '../services/locations.service';
import { TypesService } from '../services/types.service';
import { DomSanitizer } from '@angular/platform-browser';
import { OwnersService } from '../services/owners.service';
import { ConsultantsService } from '../services/consultants.service';
import { InternalCharsService } from '../services/internal-chars.service';
import { ExternalCharsService } from '../services/external-chars.service';
import { SectorCharsService } from '../services/sector-chars.service';
import { PublishService } from '../services/publish.service';


import { PropertyCreatorComponent } from './propertyCreator.component';
import { PropertyDetailDialogComponent } from './propertyDetailDialog.component';
import { ConfirmComponent } from '../shared/confirm.component';
import { IntegrationsService } from "../services/integrations.service";
import { ShareAppropiateComponent } from "./shareAppropiate.component";
// import { ShareButtons } from '@ngx-share/core';
import { CeiboShare } from 'ng2-social-share';

/*declare var $: any;
 declare var fotorama: any;*/

@Component({
    selector: 'app-properties',
    templateUrl: 'properties.component.html',
    styleUrls: ['properties.component.scss'],
    // directives:[CeiboShare]
})
export class PropertiesComponent implements OnInit, OnDestroy {

    // *********************** VARIABLES INICIALES ************************************

    // imageInput, input para agregar imagen que debo limpiar despues de hacer el upload de la imágen.
    @ViewChild('imageInput') imageInput;
    // ControlGroup para el formulario para ingresar, editar

    propertiesForm: FormGroup;
    // lista de propiedades que se muestran en la tabla principal
    property_list: Property[] = [];
    // lista de tipos que se muestran en el formulario de ingreso/edicion
    type_list: Type[] = [{ id: 1, name: 'Cargando...' }];
    // lista de tipos que se muestran en el formulario de ingreso/edicion
    consultant_list: Consultant[] = [{ id: 1, name: 'Cargando...', phone: 0, email: '' }];
    // lista de tipos que se muestran en el formulario de ingreso/edicion
    owner_list: Owner[] = [{ id: 1, name: 'Cargando...', email: '', document: 0, phone1: 0, phone2: 0, date: null }];

    publish_options = [{ id: 1, name: 'Si' }, { id: 0, name: 'No' }];

    sharing_options = [{ id: 1, name: 'Si' }, { id: 0, name: 'No' }];
    // lista de características internas de las propiedades
    internal_char_list: InternalChar[];
    // lista de características externas de las propiedades
    external_char_list: ExternalChar[];
    // lista de características de los sectores
    sector_char_list: SectorChar[];
    // lista de ubicaciones que se muestran en el formulario de ingreso/edicion
    location_list: Location[] = [{ id: 1, name: 'Cargando...' }];
    // lista de unidades de area que se muestran en el formulario de ingreso/edicion
    unit_list: Unit[] = [];
    // lista de tipos de negocios en que se muestran las propiedades en el formulario de ingreso/edicion
    propertyOn_list: PropertyOn[] = [{ id: 1, name: 'Venta' }, { id: 2, name: 'Arriendo' }, { id: 3, name: 'Cambio' }];
    // listado de estados
    status_list: Status[] = [{ id: 1, name: 'Disponible' }, { id: 2, name: 'No disponible' }, {
        id: 3,
        name: 'Vendida'
    }, { id: 4, name: 'Arrendada' }];
    // Token para la información de la bd
    token: any;
    // Id del usuario en la base de datos
    userId: any;
    // Id del mlsId para verificar si el usuario pertenece a una mls
    mlsId: any;
    // Listado de downlines
    mls_downlines: any;
    // Me suscribo a las acciones del servicio de agregar propiedad
    addPropertySubscription: any;

    position: TooltipPosition = 'below';

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
    dialogRef: MdDialogRef<PropertyCreatorComponent>;
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

    lastCloseResult: any;

    // Dialog para ver los detalles de una propiedad
    PropertyDetailDialogRef: MdDialogRef<PropertyDetailDialogComponent>;
    propertyDetailDialogConfig: MdDialogConfig = {
        disableClose: false,
        width: '90vw',
        height: '',
        position: {
            top: '',
            bottom: '',
            left: '',
            right: ''
        }
    };

    ShareAppropiateDialogRef: MdDialogRef<ShareAppropiateComponent>;
    shareAppropiateDialogConfig: MdDialogConfig = {
        disableClose: false,
        width: '90vw',
        height: '',
        position: {
            top: '',
            bottom: '',
            left: '',
            right: ''
        }
    };


    propertiesLoaded = false;
    propertiesLoading = false;

    propertiesFilter: FormGroup;

    reactiveLocations: any;
    reactiveTypes: any;
    reactivePropertiesOn: any;
    reactiveOwners: any;
    reactiveConsultants: any;
    reactivePublish: any;
    reactiveStatuses: any;
    reactiveSharing: any;

    idLocationFilter: FormControl;
    idTypeFilter: FormControl;
    idPropertyOnFilter: FormControl;
    idOwnerFilter: FormControl;
    idConsultantFilter: FormControl;
    idPublishFilter: FormControl;
    idStatusFilter: FormControl;
    idSharingFilter: FormControl;

    locationsPage = 1;
    propertiesPage = 1;
    typesPage = 1;
    ownersPage = 1;
    consultantsPage = 1;

    object: any;

    itemSelected: any;
    editingItem = false;

    loadMore = true;
    loadingMore = false;

    deletedBeforeLoadMore = 0;

    integrations: any;

    constructor(private _propertiesService: PropertiesService,
        private _typesService: TypesService,
        private _locationsService: LocationsService,
        private _ownersService: OwnersService,
        private _consultantsService: ConsultantsService,
        private _addPropertyService: addPropertyService,
        private _internalCharsService: InternalCharsService,
        private _externalCharsService: ExternalCharsService,
        private _sectorCharsService: SectorCharsService,
        private _publishService: PublishService,
        private _integrationsService: IntegrationsService,
        private _sanitizer: DomSanitizer,
        public dialog: MdDialog
    ) {

        this.addPropertySubscription = this._addPropertyService.addPropertyPromise()
            .subscribe(
            value => {
                if (value) {
                    this.openPropertyCreator(0);
                    this.editingItem = false;
                }
            },
            error => console.log(error)
            );

        // iniciar con el input de ubicaciones Cargando...
        this.idLocationFilter = new FormControl('');
        this.reactiveLocations = this.idLocationFilter.valueChanges
            .startWith(this.idLocationFilter.value)
            .map(val => this.displayFn(val))
            .map(name => this.filterStates(name, this.location_list));

        // iniciar con el input de tipos Cargando...
        this.idTypeFilter = new FormControl('');
        this.reactiveTypes = this.idTypeFilter.valueChanges
            .startWith(this.idTypeFilter.value)
            .map(val => this.displayFn(val))
            .map(name => this.filterStates(name, this.type_list));

        // iniciar con el input de negocios con los negocios disponibles
        this.idPropertyOnFilter = new FormControl('');
        this.reactivePropertiesOn = this.idPropertyOnFilter.valueChanges
            .startWith(this.idPropertyOnFilter.value)
            .map(val => this.displayFn(val))
            .map(name => this.filterStates(name, this.propertyOn_list));

        // iniciar con el input de estados con los estados disponibles
        this.idStatusFilter = new FormControl('');
        this.reactiveStatuses = this.idStatusFilter.valueChanges
            .startWith(this.idStatusFilter.value)
            .map(val => this.displayFn(val))
            .map(name => this.filterStates(name, this.status_list));

        // iniciar con el input de propietarios Cargando...
        this.idOwnerFilter = new FormControl('');
        this.reactiveOwners = this.idOwnerFilter.valueChanges
            .startWith(this.idOwnerFilter.value)
            .map(val => this.displayFn(val))
            .map(name => this.filterStates(name, this.owner_list));

        // iniciar con el input de asesores Cargando...
        this.idConsultantFilter = new FormControl('');
        this.reactiveConsultants = this.idConsultantFilter.valueChanges
            .startWith(this.idConsultantFilter.value)
            .map(val => this.displayFn(val))
            .map(name => this.filterStates(name, this.consultant_list));


        this.idPublishFilter = new FormControl('');

        this.idSharingFilter = new FormControl('');

    }

    ngOnInit(): any {

        this.integrations = JSON.parse(localStorage.getItem('integrations'));
        this.token = localStorage.getItem('token');
        this.userId = localStorage.getItem('userId');
        this.mlsId = localStorage.getItem('mlsId');
        this.mls_downlines = localStorage.getItem('mls_downlines');

        // Defino la estructura del formulario de ingreso/edición.
        this.propertiesFilter = new FormGroup({
            'code': new FormControl('', []),
            'location': this.idLocationFilter,
            'type': this.idTypeFilter,
            'property_on': this.idPropertyOnFilter,
            'priceFrom': new FormControl('', []),
            'priceTo': new FormControl('', []),
            'areaFrom': new FormControl('', []),
            'areaTo': new FormControl('', []),
            'floors': new FormControl('', []),
            'roomsFrom': new FormControl('', []),
            'bathsFrom': new FormControl('', []),
            'parkings': new FormControl('', []),
            'livings': new FormControl('', []),
            'image': new FormControl('', []),
            'admon_comments': new FormControl('', []),
            'consultant': this.idConsultantFilter,
            'owner': this.idOwnerFilter,
            'status': this.idStatusFilter,
            'publish': this.idPublishFilter,
            'sharing': this.idSharingFilter,
            'property_registration': new FormControl('', [])
        });

        this.propertiesFilter.valueChanges.debounceTime(1000).subscribe(
            () => {
                if (this.propertiesFilterActive()) {
                    this.filterProperties(1);
                } else {
                    this.reloadProperties();
                }
            }
        );

        this.propertiesFilter.controls['owner'].valueChanges.debounceTime(700).subscribe(
            () => {
                let val = this.propertiesFilter.controls['owner'].value;
                if (typeof val == 'string') {

                    val = val.replace(/[^a-z\d\s]+/gi, '');
                    if (this.owner_list.filter((s) => s.name.match(new RegExp(val, 'gi'))).length <= 5) {
                        const gridState = {
                            search: {
                                predicateObject: { name: val }
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

                        this._ownersService.getItemsFilteredBy(gridState, 1)
                            .subscribe(
                            response => {
                                this.owner_list = response.data;
                                this.reactiveOwners = this.idOwnerFilter.valueChanges
                                    .startWith(this.idOwnerFilter.value)
                                    .map(val => this.displayFn(val))
                                    .map(name => this.filterStates(name, this.owner_list));
                            },
                            error => console.log(error)
                            );
                    }
                }
            }
        );

        this.propertiesFilter.controls['consultant'].valueChanges.debounceTime(700).subscribe(
            () => {
                let val = this.propertiesFilter.controls['consultant'].value;
                if (typeof val == 'string') {

                    val = val.replace(/[^a-z\d\s]+/gi, '');
                    if (this.consultant_list.filter((s) => s.name.match(new RegExp(val, 'gi'))).length <= 5) {
                        const gridState = {
                            search: {
                                predicateObject: { name: val }
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

                        this._consultantsService.getItemsFilteredBy(gridState, 1)
                            .subscribe(
                            response => {
                                console.log(response);

                                this.consultant_list = response.data;
                                this.reactiveConsultants = this.idConsultantFilter.valueChanges
                                    .startWith(this.idConsultantFilter.value)
                                    .map(val => this.displayFn(val))
                                    .map(name => this.filterStates(name, this.consultant_list));
                            },
                            error => console.log(error)
                            );
                    }
                }
            }
        );

        this.reactivePublish = this.idPublishFilter.valueChanges
            .startWith(this.idPublishFilter.value)
            .map(val => this.displayFn(val))
            .map(name => this.filterStates(name, this.publish_options));

        this.reactiveSharing = this.idSharingFilter.valueChanges
            .startWith(this.idSharingFilter.value)
            .map(val => this.displayFn(val))
            .map(name => this.filterStates(name, this.sharing_options));

        // Cargo el tipo de propiedades que hay en la bd
        this._typesService.getItems(this.typesPage)
            .subscribe(
            response => {
                this._typesService.type_list = response.data;
                this.type_list = this._typesService.type_list;
                this.reactiveTypes = this.idTypeFilter.valueChanges
                    .startWith(this.idTypeFilter.value)
                    .map(val => this.displayFn(val))
                    .map(name => this.filterStates(name, this.type_list));
                /*                        .do(changes => {
                 console.log('algo ha cambiado:', changes);
                 });
                 Esto muestra el resultado de la lista despues de los cambios */
            },
            error => console.log(error)
            );

        // Cargo el listado de las ubicaciones
        this._locationsService.getItems(this.locationsPage)
            .subscribe(
            response => {
                this._locationsService.location_list = response.data;
                this.location_list = this._locationsService.location_list;
                this.locationsPage = response.current_page + 1;
                this.reactiveLocations = this.idLocationFilter.valueChanges
                    .startWith(this.idLocationFilter.value)
                    .map(val => this.displayFn(val))
                    .map(name => this.filterStates(name, this.location_list));
                // .debounceTime(1000)
            },
            error => console.log(error)
            );

        // Cargo el listado de las propietarios
        this._ownersService.getItems(this.ownersPage)
            .subscribe(
            response => {
                this._ownersService.owner_list = response.data;
                this.owner_list = this._ownersService.owner_list;
                this.ownersPage = response.current_page + 1;
                this.reactiveOwners = this.idOwnerFilter.valueChanges
                    .startWith(this.idOwnerFilter.value)
                    .map(val => this.displayFn(val))
                    .map(name => this.filterStates(name, this.owner_list));
                // .debounceTime(1000)
            },
            error => console.log(error)
            );


        // Cargo el listado de las asesores
        this._consultantsService.getItems(this.consultantsPage)
            .subscribe(
            response => {
                this._consultantsService.consultant_list = response.data;
                this.consultant_list = this._consultantsService.consultant_list;
                this.consultantsPage = response.current_page + 1;
                this.reactiveConsultants = this.idConsultantFilter.valueChanges
                    .startWith(this.idConsultantFilter.value)
                    .map(val => this.displayFn(val))
                    .map(name => this.filterStates(name, this.consultant_list));
                // .debounceTime(1000)
            },
            error => console.log(error)
            );

        this._internalCharsService.getAllItems()
            .subscribe(
            res => {
                if (res) {
                    this._internalCharsService.internal_char_list = res.data;
                    this.internal_char_list = this._internalCharsService.internal_char_list;
                }
            },
            error => console.log(error)
            );


        this._externalCharsService.getAllItems()
            .subscribe(
            res => {
                if (res) {
                    this._externalCharsService.external_char_list = res.data;
                    this.external_char_list = this._externalCharsService.external_char_list;
                }
            },
            error => console.log(error)
            );

        this._sectorCharsService.getAllItems()
            .subscribe(
            res => {
                if (res) {
                    this._sectorCharsService.sector_char_list = res.data;
                    this.sector_char_list = this._sectorCharsService.sector_char_list;
                }
            },
            error => console.log(error)
            );

        this.reloadProperties();
    }

    ngOnDestroy(): any {
        this.addPropertySubscription.unsubscribe();
    }

    openConfirmDialog(data: any) {
        this.confirmConfig.data = { loading: data.loading, ok: data.ok, cancel: data.cancel };
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

    filterStates(val: string, list: any) {
        val ? val = val.replace(/[^a-z\d\s]+/gi, '') : val = '';
        return val ? list.filter((s) => s.name.match(new RegExp(val, 'gi'))) : list;
    }

    reloadProperties() {
        this.deletedBeforeLoadMore = 0;
        this._propertiesService.getItems(1)
            .subscribe(
            response => {
                // Actualizo el valor de la lista de propiedades en el servicio.
                this._propertiesService.property_list = response.data;
                this.propertiesPage = response.current_page + 1;
                if (response.to == response.total || response.data.length == 0) {
                    this.loadMore = false;
                } else {
                    this.loadMore = true;
                }
                // Igualo el valor de la lista de propiedades local a la del servicio.
                this.property_list = this._propertiesService.property_list;
                this.propertiesLoaded = true;
                this._addPropertyService.buttonValue(true);
                this.loadingMore = false;
                this.propertiesLoading = false;
            },
            error => console.log(error)
            );
    }

    loadProperties() {
        this.loadingMore = true;
        let count = 0;
        Object.keys(this.propertiesFilter.controls).forEach(key => {
            if (this.propertiesFilter.get(key).value) {
                count = count + 1;
            }
        });
        if (count == 0) {
            if (this.deletedBeforeLoadMore > 0) {
                this._propertiesService.getItems(this.propertiesPage - 1)
                    .subscribe(
                    response => {
                        let length = response.data.length - 1;
                        let from = length - this.deletedBeforeLoadMore;
                        for (var j = from; j < length; j++) {
                            this._propertiesService.property_list.push(response.data[j + 1]);
                        }
                        this.property_list = this._propertiesService.property_list;

                        this._propertiesService.getItems(this.propertiesPage)
                            .subscribe(
                            response => {
                                // Actualizo el valor de la lista de propiedades en el servicio.
                                Array.prototype.push.apply(this._propertiesService.property_list, response.data);
                                this.propertiesPage = response.current_page + 1;
                                if (response.to == response.total || response.data.length == 0) {
                                    this.loadMore = false;
                                } else {
                                    this.loadMore = true;
                                }
                                // Igualo el valor de la lista de propiedades local a la del servicio.
                                this.property_list = this._propertiesService.property_list;
                                this.deletedBeforeLoadMore = 0;
                                this.loadingMore = false;
                            },
                            error => console.log(error)
                            );
                    },
                    error => console.log(error)
                    );
            } else {
                this._propertiesService.getItems(this.propertiesPage)
                    .subscribe(
                    response => {
                        // Actualizo el valor de la lista de propiedades en el servicio.
                        Array.prototype.push.apply(this._propertiesService.property_list, response.data);
                        this.propertiesPage = response.current_page + 1;
                        if (response.to == response.total || response.data.length == 0) {
                            this.loadMore = false;
                        } else {
                            this.loadMore = true;
                        }
                        // Igualo el valor de la lista de propiedades local a la del servicio.
                        this.property_list = this._propertiesService.property_list;
                        this.deletedBeforeLoadMore = 0;
                        this.loadingMore = false;
                    },
                    error => console.log(error)
                    );
            }
        } else {
            this.filterProperties(this.propertiesPage);
        }


    }

    filterProperties(index: number) {
        this.loadingMore = true;
        const value = this.propertiesFilter.value;

        const attributes = {
            code: value.code ? value.code : undefined,
            type: value.type ? value.type.id : undefined,
            location: value.location ? value.location.id : undefined,
            property_on: value.property_on ? value.property_on.id : undefined,
            priceFrom: value.priceFrom ? value.priceFrom : undefined,
            priceTo: value.priceTo ? value.priceTo : undefined,
            areaFrom: value.areaFrom ? value.areaFrom : undefined,
            areaTo: value.areaTo ? value.areaTo : undefined,
            floors: value.floors ? value.floors : undefined,
            roomsFrom: value.roomsFrom ? value.roomsFrom : undefined,
            bathsFrom: value.bathsFrom ? value.bathsFrom : undefined,
            parkingsFrom: value.parkingsFrom ? value.parkingsFrom : undefined,
            livingsFrom: value.livingsFrom ? value.livingsFrom : undefined,
            admon_comments: value.admon_comments ? value.admon_comments : undefined,
            consultant: value.consultant ? value.consultant.id : undefined,
            owner: value.owner ? value.owner.id : undefined,
            status: value.status ? value.status.id : undefined,
            publish: value.publish ? value.publish.id : undefined,
            sharing: value.sharing ? value.sharing.id : undefined,
            hasImage: value.image ? value.image.id : undefined,
            property_registration: value.property_registration ? value.property_registration : undefined
        };

        const gridState = {
            search: {
                predicateObject: attributes
            }
        };

        if (index == 1) {
            this.propertiesLoading = true;
        }

        if (this.deletedBeforeLoadMore > 0) {
            this._propertiesService.getItemsFilteredBy(gridState, index - 1)
                .subscribe(
                response => {
                    let length = response.data.length - 1;
                    let from = length - this.deletedBeforeLoadMore;
                    for (var j = from; j < length; j++) {
                        this._propertiesService.property_list.push(response.data[j + 1]);
                    }
                    this.property_list = this._propertiesService.property_list;

                    this._propertiesService.getItemsFilteredBy(gridState, index)
                        .subscribe(
                        response => {
                            if (index == 1) {
                                this._propertiesService.property_list = response.data;
                                this.propertiesLoading = false;
                            } else {
                                Array.prototype.push.apply(this._propertiesService.property_list, response.data);
                            }
                            this.propertiesPage = response.current_page + 1;
                            if (response.to == response.total || response.data.length == 0) {
                                this.loadMore = false;
                            } else {
                                this.loadMore = true;
                            }
                            // Igualo el valor de la lista de propiedades local a la del servicio.
                            this.property_list = this._propertiesService.property_list;
                            this.deletedBeforeLoadMore = 0;
                            this.loadingMore = false;
                        },
                        error => console.log(error)
                        );
                },
                error => console.log(error)
                );
        } else {

            this._propertiesService.getItemsFilteredBy(gridState, index)
                .subscribe(
                response => {
                    if (index == 1) {
                        this._propertiesService.property_list = response.data;
                        this.propertiesLoading = false;
                    } else {
                        Array.prototype.push.apply(this._propertiesService.property_list, response.data);
                    }
                    this.propertiesPage = response.current_page + 1;
                    if (response.to == response.total || response.data.length == 0) {
                        this.loadMore = false;
                    } else {
                        this.loadMore = true;
                    }
                    // Igualo el valor de la lista de propiedades local a la del servicio.
                    this.property_list = this._propertiesService.property_list;
                    this.deletedBeforeLoadMore = 0;
                    this.loadingMore = false;
                },
                error => console.log(error)
                );
        }
    }

    propertiesFilterActive() {
        let count = 0;
        Object.keys(this.propertiesFilter.controls).forEach(key => {
            if (this.propertiesFilter.get(key).value) {
                count = count + 1;
            }
        });

        if (count > 0) {
            return true;
        } else {
            return false;
        }
    }

    cleanPropertiesFilter() {
        this.propertiesLoading = true;
        Object.keys(this.propertiesFilter.controls).forEach(key => {
            this.propertiesFilter.get(key).reset();
        });
    }

    openPropertyCreator(item: any) {
        this.config.data = item;
        this.dialogRef = this.dialog.open(PropertyCreatorComponent, this.config);
        this.dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.lastCloseResult = result;
                if (this.editingItem) {
                    this._propertiesService.property_list[this._propertiesService.getIndexOfItem(this.itemSelected)] = result;
                    this.property_list = this._propertiesService.property_list;
                } else {
                    this._propertiesService.property_list.unshift(this.lastCloseResult);
                    this.property_list = this._propertiesService.property_list;
                }
                this.itemSelected = null;
                this.editingItem = false;
            }
            this.dialogRef = null;
        });
    }

    onDelete(item: Property) {
        const data = {
            title: '¿Está seguro que desea borrar esta propiedad?',
            subtitle: 'Al borrar una propiedad no podrá recuperarla.',
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

                if (item.sharing) {

                    this._propertiesService.unshareProperty(item.id)
                        .subscribe(
                        response => {

                            this._propertiesService.deleteItem(item.id).subscribe(
                                response => {
                                    this.deletedBeforeLoadMore = this.deletedBeforeLoadMore + 1;
                                    this._propertiesService.property_list.splice(this._propertiesService.getIndexOfItem(item), 1);
                                    this.confirmRef.close();
                                },
                                error => {
                                    console.log(error);
                                    this.confirmRef.close();
                                }
                            );
                        },
                        error => console.log(error)
                        );

                } else {
                    this._propertiesService.deleteItem(item.id).subscribe(
                        response => {
                            this.deletedBeforeLoadMore = this.deletedBeforeLoadMore + 1;
                            this._propertiesService.property_list.splice(this._propertiesService.getIndexOfItem(item), 1);
                            this.confirmRef.close();
                        },
                        error => {
                            console.log(error);
                            this.confirmRef.close();
                        }
                    );
                }
                this.dialogRef = null;
            } else {
                this.dialogRef = null;
            }
        });

    }

    onSelect(item: Property) {
        if (item.sharing) {
            const data = {
                title: 'Propiedad pública',
                subtitle: '¿Deseas dejar de compartir esta propiedad para poder editarla?',
                ok: true,
                cancel: true
            };

            this.confirmConfig.data = data;
            this.confirmRef = this.dialog.open(ConfirmComponent, this.confirmConfig);
            this.confirmRef.afterClosed().subscribe(result => {
                if (result) {
                    const info = {
                        loading: true
                    };
                    this.openConfirmDialog(info);

                    this._propertiesService.unshareProperty(item.id)
                        .subscribe(
                        response => {
                            this._propertiesService.property_list[this._propertiesService.getIndexOfItem(item)].sharing = 0;
                            this.property_list = this._propertiesService.property_list;
                            this.editingItem = true;
                            this.itemSelected = item;
                            this.dialogRef = null;
                            this.confirmRef.close();
                            this.openPropertyCreator(item);
                        },
                        error => console.log(error)
                        );
                } else {
                    this.dialogRef = null;
                }
            });
        } else {
            this.editingItem = true;
            this.itemSelected = item;
            this.openPropertyCreator(item);
        }
    }

    openPropertyDetailDialog(item: Property) {
        this.propertyDetailDialogConfig.data = item;
        this.PropertyDetailDialogRef = this.dialog.open(PropertyDetailDialogComponent, this.propertyDetailDialogConfig);
        this.PropertyDetailDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.onSelect(result);
            }
            this.PropertyDetailDialogRef = null;
        });
    }

    getPropertyBackground(shared: number, userId: number, id: number, id_holder: number, id_holder_property: number, image: string) {
        if (shared !== 1) {
            if (image) {
                return this._sanitizer.bypassSecurityTrustStyle(
                    'url("https://s3-us-west-2.amazonaws.com/inmobiliarias/' +
                    userId +
                    '/images/properties/' +
                    id +
                    '/small/' +
                    image +
                    '")');
            } else {
                return this._sanitizer.bypassSecurityTrustStyle('url("./assets/images/no_image.png")');
            }
        }

        if (shared === 1 && image) {
            if (image) {
                return this._sanitizer.bypassSecurityTrustStyle(
                    'url("https://s3-us-west-2.amazonaws.com/inmobiliarias/' +
                    id_holder +
                    '/images/properties/' +
                    id_holder_property +
                    '/small/' +
                    image +
                    '")');
            } else {
                return this._sanitizer.bypassSecurityTrustStyle('url("./assets/images/no_image.png")');
            }
        } else {
            return this._sanitizer.bypassSecurityTrustStyle('url("./assets/images/no_image.png")');
        }
    }

    getColorStatus(value: string) {
        if (value === 'Disponible') {
            return 'rgba(69,208,227,0.5)';
        }
        if (value === 'No disponible') {
            return 'rgba(125,125,125,0.5)';
        }
        if (value === 'Vendida') {
            return 'rgba(239,60,121,0.5)';
        }
        if (value === 'Arrendada') {
            return 'rgba(237,128,61,0.5)';
        }
    }

    onChangePublish(item: Property) {

        if (item.sharing || item.sharing === 1) {

            const data = {
                title: 'Propiedad pública',
                subtitle: '¿Deseas dejar de compartir esta propiedad?',
                ok: true,
                cancel: true
            };

            this.confirmConfig.data = data;
            this.confirmRef = this.dialog.open(ConfirmComponent, this.confirmConfig);
            this.confirmRef.afterClosed().subscribe(result => {
                if (result) {
                    const info = {
                        loading: true
                    };
                    this.openConfirmDialog(info);

                    this._propertiesService.unshareProperty(item.id)
                        .subscribe(
                        response => {
                            this._propertiesService.property_list[this._propertiesService.getIndexOfItem(item)].sharing = 0;
                            this.property_list = this._propertiesService.property_list;
                            this.confirmRef.close();
                            this.changePublish(item);
                        },
                        error => console.log(error)
                        );
                } else {
                    this.dialogRef = null;
                }
            });

        } else {

            this.changePublish(item);

        }

    }

    changePublish(item: Property) {

        // Cargando...
        const info = {
            loading: true
        };

        this.openConfirmDialog(info);

        let publish = item.publish;
        if (!publish || publish === 0) {
            publish = 1;
        } else if (publish === 1 || publish !== 0) {
            publish = 0;
        }

        const data = {
            id: item.id,
            status: publish
        };


        this._publishService.changePublish(data)
            .subscribe(
            res => {
                this.confirmRef.close();
                this._propertiesService.property_list[this._propertiesService.getIndexOfItem(item)].publish = publish;
                this.property_list = this._propertiesService.property_list;
            },
            error => console.log(error)
            );

    }

    onShareProperty(item: Property) {
        // Cargando...
        const info = {
            loading: true
        };

        this.openConfirmDialog(info);

        if (item.sharing == 0 || !item.sharing) {
            this._propertiesService.shareProperty(item.id)
                .subscribe(
                response => {
                    this.confirmRef.close();
                    this._propertiesService.property_list[this._propertiesService.getIndexOfItem(item)].sharing = 1;
                    this.property_list = this._propertiesService.property_list;
                },
                error => console.log(error)
                );
        } else {
            this._propertiesService.unshareProperty(item.id)
                .subscribe(
                response => {
                    this.confirmRef.close();
                    this._propertiesService.property_list[this._propertiesService.getIndexOfItem(item)].sharing = 0;
                    this.property_list = this._propertiesService.property_list;
                },
                error => console.log(error)
                );
        }

    }

    openShareAppropiateComponent(item: Property, integration: string, active?: any) {
        this.shareAppropiateDialogConfig.data = { item: item, integration: integration, active: active };
        this.ShareAppropiateDialogRef = this.dialog.open(ShareAppropiateComponent, this.shareAppropiateDialogConfig);
        this.ShareAppropiateDialogRef.afterClosed().subscribe(result => {
            if (result.error) {

            } else {
                this._propertiesService.property_list[this._propertiesService.getIndexOfItem(item)].id_property_appropiate = result.externalSystemId;
                this.property_list = this._propertiesService.property_list;
                const data = {
                    title: 'Propiedad compartida a Appropiate',
                    subtitle: result.message + '. Código: ' + result.externalSystemCode,
                    ok: true,
                    cancel: false
                };

                this.confirmConfig.data = data;
                this.confirmRef = this.dialog.open(ConfirmComponent, this.confirmConfig);
                this.confirmRef.afterClosed().subscribe(result => {
                    this.dialogRef = null;
                });
                this.integrations = JSON.parse(localStorage.getItem('integrations'));
            }
            this.ShareAppropiateDialogRef = null;
        });
    }

    integrationActive(name: string) {
        let response = false;
        Object.keys(this.integrations).forEach(key => {
            if (this.integrations[key].external_system_code == name) {
                response = true;
            }
        });

        if (response) {
            return true;
        } else {
            return false;
        }
    }

    shareAppropiate(item: any) {
        let data = {
            id: item.id,
            externalSystemCode: 'APPROPIATE'
        };

        if (this.integrationActive('APPROPIATE')) {

            let data = {
                id: item.id,
                externalSystemCode: 'APPROPIATE'
            };

            if (item.id_property_appropiate) {

                const info = {
                    loading: true
                };

                this.openConfirmDialog(info);

                this._integrationsService.deleteProperty(data)
                    .subscribe(
                    response => {
                        this._propertiesService.property_list[this._propertiesService.getIndexOfItem(item)].id_property_appropiate = null;
                        this.property_list = this._propertiesService.property_list;
                        this.confirmRef.close();
                        const data = {
                            title: 'Propiedad eliminada de Appropiate',
                            subtitle: '',
                            ok: true,
                            cancel: false
                        };

                        this.confirmConfig.data = data;
                        this.confirmRef = this.dialog.open(ConfirmComponent, this.confirmConfig);
                        this.confirmRef.afterClosed().subscribe(result => {
                            this.dialogRef = null;
                        });
                    },
                    error => {
                        console.log(error);
                        this.confirmRef.close();
                    }
                    );

            } else {
                const info = {
                    loading: true
                };

                this.openConfirmDialog(info);

                this._integrationsService.shareAppropiate(data)
                    .subscribe(
                    response => {
                        this.confirmRef.close();
                        if (response.error) {
                            this.openShareAppropiateComponent(item, 'APPROPIATE', true);
                        } else {
                            this._propertiesService.property_list[this._propertiesService.getIndexOfItem(item)].id_property_appropiate = response.externalSystemId;
                            this.property_list = this._propertiesService.property_list;
                            const data = {
                                title: 'Propiedad compartida a Appropiate',
                                subtitle: response.message + '. Código: ' + response.externalSystemCode,
                                ok: true,
                                cancel: false
                            };

                            this.confirmConfig.data = data;
                            this.confirmRef = this.dialog.open(ConfirmComponent, this.confirmConfig);
                            this.confirmRef.afterClosed().subscribe(result => {
                                this.dialogRef = null;
                            });
                        }
                    },
                    error => console.log(error)
                    );
            }
        } else {
            this.openShareAppropiateComponent(item, 'APPROPIATE', false);
        }
    }
}
