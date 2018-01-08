import { Component, OnInit, ViewChild, NgZone, OnDestroy, Inject } from '@angular/core';
import { MD_DIALOG_DATA, TooltipPosition } from '@angular/material';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Type } from '../services/type';
import { InternalChar } from '../services/internal-char';
import { ExternalChar } from '../services/external-char';
import { SectorChar } from '../services/sector-char';
import { Status } from '../services/status';
import { PropertyOn } from '../services/propertyOn';
import { Location } from '../services/location';
import { Consultant } from "../services/consultant";
import { Owner } from "../services/owner";

import 'rxjs/add/operator/startWith';

import { PropertiesService } from '../services/properties.service';
import { LocationsService } from '../services/locations.service';
import { TypesService } from '../services/types.service';
import { OwnersService } from '../services/owners.service';
import { ConsultantsService } from '../services/consultants.service';
import { InternalCharsService } from '../services/internal-chars.service';
import { ExternalCharsService } from '../services/external-chars.service';
import { SectorCharsService } from '../services/sector-chars.service';
import { ImagesService } from "../services/images.service";
import { SectorsService } from "../services/sectors.service";
import { Sector } from "../services/sector";

import { ConfirmComponent } from '../shared/confirm.component';

declare var fotorama: any;

@Component({
    selector: 'app-jazz-dialog',
    templateUrl: 'propertyCreator.component.html',
    styleUrls: ['propertyCreator.component.scss']
})
export class PropertyCreatorComponent implements OnInit {

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
    propertiesForm: FormGroup;

    reactiveLocations: any;
    reactiveTypes: any;
    reactivePropertiesOn: any;
    reactiveUnits: any;
    reactiveOwners: any;
    reactiveConsultants: any;
    reactiveStatuses: any;
    reactiveStratums: any;
    reactiveSectors: any;

    tdOwners: any;
    tdConsultants: any[];
    tdStratums: any[];

    idLocationFilter: FormControl;
    idTypeFilter: FormControl;
    idPropertyOnFilter: FormControl;
    idUnitFilter: FormControl;
    idOwnerFilter: FormControl;
    idConsultantFilter: FormControl;
    idStatusFilter: FormControl;
    idStratumsFilter: FormControl;
    idSectorFilter: FormControl;

    location_list: Location[] = [];
    type_list: Type[] = [];
    // lista de tipos de negocios en que se muestran las propiedades en el formulario de ingreso/edicion
    propertyOn_list: PropertyOn[] = [{ id: 1, name: 'Venta' }, { id: 2, name: 'Arriendo' }, { id: 3, name: 'Cambio' }];
    // listado de estados
    status_list: Status[] = [{ id: 1, name: 'Disponible' }, { id: 2, name: 'No disponible' }, {
        id: 3,
        name: 'Vendida'
    }, { id: 4, name: 'Arrendada' }];
    stratum_list = [{ id: 1, name: "1" }, { id: 2, name: "2" }, { id: 3, name: "3" }, { id: 4, name: "4" }, {
        id: 5,
        name: "5"
    }, { id: 6, name: "6" }];
    // lista de tipos de negocios en que se muestran las propiedades en el formulario de ingreso/edicion
    unit_list: PropertyOn[] = [{ id: 1, name: 'm2' }, { id: 2, name: 'ha' }, { id: 3, name: 'cuadras' }];
    consultant_list: Consultant[];
    owner_list: Owner[];
    sector_list: Sector[];

    propertyLoaded = false;

    userId: any;
    property;

    owner_name: any;

    consultant_name: string;

    showErrors = false;

    addingProperty = false;
    editingProperty = false;

    // lista de características internas de las propiedades
    internal_char_list: InternalChar[];
    item_internal_char_list = [];
    // lista de características externas de las propiedades
    external_char_list: ExternalChar[];
    item_external_char_list = [];
    // lista de características de los sectores
    sector_char_list: SectorChar[];
    item_sector_char_list = [];

    // Mostrar un preview de las imágenes que se van a subir.
    previewImages = [];
    // Si el archivo seleccionado no es una imágen, muestra error.
    fileNotImage = false;
    // Para correr fuera de angular.
    zone: NgZone;

    // Preview de la imagen principal.
    principalImagePreview: any = [];

    // imageInput, input para agregar imagen que debo limpiar despues de hacer el upload de la imágen.
    @ViewChild('images') images;

    property_internal_details: FormArray;
    property_external_details: FormArray;
    property_sector_details: FormArray;

    property_images: FormArray;

    last_location_value: any;

    addSector = false;

    resizingImages = false;

    positionImage = 0;

    addingSector = false;

    addingConsult = false;
    addConsult = false;
    addOwner = false;
    addingOwner = false;
    detailOwner = "";
    detailConsultant = "";
    

    constructor(private _propertiesService: PropertiesService,
        private _ownersService: OwnersService,
        private _consultantsService: ConsultantsService,
        private _locationsService: LocationsService,
        private _typesService: TypesService,
        private _internalCharsService: InternalCharsService,
        private _externalCharsService: ExternalCharsService,
        private _sectorCharsService: SectorCharsService,
        private _sectorsService: SectorsService,
        private _imagesService: ImagesService,
        private _zone: NgZone,
        public dialog: MdDialog,
        public dialogRef: MdDialogRef<PropertyCreatorComponent>,
        @Inject(MD_DIALOG_DATA) public item: any) {

        this.zone = _zone;

        this.idLocationFilter = new FormControl('', [Validators.required]);
        this.idTypeFilter = new FormControl('', [Validators.required]);
        this.idPropertyOnFilter = new FormControl('', [Validators.required]);
        this.idStatusFilter = new FormControl('', [Validators.required]);
        this.idStratumsFilter = new FormControl('', []);
        this.idUnitFilter = new FormControl('', [Validators.required]);
        this.idConsultantFilter = new FormControl('', []);
        this.idOwnerFilter = new FormControl('', []);
        this.idSectorFilter = new FormControl('', []);
    }

    ngOnInit(): any {

        this.userId = localStorage.getItem('userId');

        this.internal_char_list = this._internalCharsService.internal_char_list;

        this.external_char_list = this._externalCharsService.external_char_list;

        this.sector_char_list = this._sectorCharsService.sector_char_list;

        this.property_internal_details = new FormArray([]);
        this.property_external_details = new FormArray([]);
        this.property_sector_details = new FormArray([]);

        this.property_images = new FormArray([]);

        // Defino la estructura del formulario de ingreso/edición.
        this.propertiesForm = new FormGroup({
            'id': new FormControl('', []),
            'type': this.idTypeFilter,
            'location': this.idLocationFilter,
            'sector': this.idSectorFilter,
            'address': new FormControl('', []),
            'area': new FormControl('', [Validators.required, CustomValidators.number]),
            'unit': this.idUnitFilter,
            'built_area': new FormControl('', [CustomValidators.number]),
            'property_on': this.idPropertyOnFilter,
            'owner': this.idOwnerFilter,
            'price': new FormControl('', [Validators.required, CustomValidators.number]),
            'status': this.idStatusFilter,
            'administration': new FormControl('', [CustomValidators.number]),
            'stratum': this.idStratumsFilter,
            'consultant': this.idConsultantFilter,
            'commission': new FormControl('', [CustomValidators.number]),
            'comments': new FormControl('', []),
            'admon_comments': new FormControl('', []),
            'images': this.property_images,
            'baths': new FormControl('', [CustomValidators.number]),
            'rooms': new FormControl('', [CustomValidators.number]),
            'livings': new FormControl('', [CustomValidators.number]),
            'floors': new FormControl('', [CustomValidators.number]),
            'parkings': new FormControl('', [CustomValidators.number]),
            'id_holder': new FormControl(this.userId, []),
            'property_internal_details': this.property_internal_details,
            'property_external_details': this.property_external_details,
            'property_sector_details': this.property_sector_details,
            'property_registration': new FormControl('', []),
            'id_property_appropiate': new FormControl('', [])
        });

        this.propertiesForm.controls['owner'].valueChanges.debounceTime(700).subscribe(
            () => {
                let val = this.propertiesForm.controls['owner'].value;
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
                                    .map(name => this.filterOwnerStates(name, this.owner_list));
                            },
                            error => console.log(error)
                            );
                    }
                }
            }
        );

        this.propertiesForm.controls['consultant'].valueChanges.debounceTime(700).subscribe(
            () => {
                let val = this.propertiesForm.controls['consultant'].value;
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
                                    .map(name => this.filterConsultStates(name, this.consultant_list));
                            },
                            error => console.log(error)
                            );
                    }
                }
            }
        );

        this.type_list = this._typesService.type_list;
        this.reactiveTypes = this.idTypeFilter.valueChanges
            .startWith(this.idTypeFilter.value)
            .map(val => this.displayFn(val))
            .map(name => this.filterStates(name, this.type_list));

        this.location_list = this._locationsService.location_list;
        this.reactiveLocations = this.idLocationFilter.valueChanges
            .startWith(this.idLocationFilter.value)
            .map(val => this.displayLocation(val))
            .map(name => this.filterStates(name, this.location_list));

        this.consultant_list = this._consultantsService.consultant_list;
        this.reactiveConsultants = this.idConsultantFilter.valueChanges
            .startWith(this.idConsultantFilter.value)
            .map(val => this.displayFn(val))
            .map(name => this.filterConsultStates(name, this.consultant_list));

        this.owner_list = this._ownersService.owner_list;
        this.reactiveOwners = this.idOwnerFilter.valueChanges
            .startWith(this.idOwnerFilter.value)
            .map(val => this.displayFn(val))
            .map(name => this.filterOwnerStates(name, this.owner_list));

        this.reactivePropertiesOn = this.idPropertyOnFilter.valueChanges
            .startWith(this.idPropertyOnFilter.value)
            .map(val => this.displayFn(val))
            .map(name => this.filterStates(name, this.propertyOn_list));

        this.reactiveStatuses = this.idStatusFilter.valueChanges
            .startWith(this.idStatusFilter.value)
            .map(val => this.displayFn(val))
            .map(name => this.filterStates(name, this.status_list));

        this.tdStratums = this.stratum_list;
        this.reactiveStratums = this.idStratumsFilter.valueChanges
            .startWith(this.idStratumsFilter.value)
            .map(val => this.displayFn(val))
            .map(name => this.filterStates(name, this.stratum_list));

        this.reactiveUnits = this.idUnitFilter.valueChanges
            .startWith(this.idUnitFilter.value)
            .map(val => this.displayFn(val))
            .map(name => this.filterStates(name, this.unit_list));


        if (this.item && typeof this.item === 'object') {

            this.editingProperty = true;

            // Cargo las propiedades con un limite (12 propiedades)
            this._propertiesService.getFile(this.item.id)
                .subscribe(
                response => {
                    if (response) {
                        const userId = this.userId;
                        this.property = response[0];
                        const property = this.property;
                        const propertyImages = property.images;
                        this.previewImages = [];
                        let id_holder;
                        let id_holder_property;
                        if (property.shared === 1) {
                            id_holder = property.id_holder;
                            id_holder_property = property.id_holder_property;
                        } else {
                            id_holder = userId;
                            id_holder_property = property.id;
                        }

                        var countImgs = propertyImages.length;
                        if (countImgs > 0) {
                            let i;
                            for (i = 0; i < countImgs; i++) {
                                var imgLoaded = "https://s3-us-west-2.amazonaws.com/inmobiliarias/" + id_holder + "/images/properties/" + id_holder_property + "/small/" + this.property.images[i].url;
                                const previewInfo = {
                                    dataUrlImage: imgLoaded,
                                    /*                                        url: this.property.images[i],
                                     position: null,*/
                                    id: this.property.images[i].id
                                };
                                this.previewImages.push(previewInfo);
                                if (this.property.image_url == this.property.images[i].url) {
                                    this.positionImage = i + 1;
                                    /*this.principalImagePreview.index = i;
                                     this.previewImages[i].position = 1;*/
                                }
                            }
                            this.principalImagePreview.img = "https://s3-us-west-2.amazonaws.com/inmobiliarias/" + id_holder + "/images/properties/" + id_holder_property + "/small/" + this.property.image_url;
                        }
                        else {
                            this.principalImagePreview = [];
                        }

                        let i;

                        for (i = 0; i < this.internal_char_list.length; i++) {
                            let j;
                            let value = false;
                            for (j = 0; j < this.property.property_internal_details.length; j++) {
                                if (this.property.property_internal_details && this.property.property_internal_details[j].internal_detail && this.property.property_internal_details[j].internal_detail.id == this.internal_char_list[i].id) {
                                    value = true;
                                    continue;
                                }
                            }
                            this.item_internal_char_list[i] = {
                                'id': this.internal_char_list[i].id,
                                'name': this.internal_char_list[i].name,
                                'value': value
                            };
                        }

                        for (i = 0; i < this.external_char_list.length; i++) {
                            let j;
                            let value = false;
                            for (j = 0; j < this.property.property_external_details.length; j++) {
                                if (this.property.property_external_details && this.property.property_external_details[j].external_detail && this.property.property_external_details[j].external_detail.id == this.external_char_list[i].id) {
                                    value = true;
                                    continue;
                                }
                            }
                            this.item_external_char_list[i] = {
                                'id': this.external_char_list[i].id,
                                'name': this.external_char_list[i].name,
                                'value': value
                            };
                        }

                        for (i = 0; i < this.sector_char_list.length; i++) {
                            let j;
                            let value = false;
                            for (j = 0; j < this.property.property_sector_details.length; j++) {
                                if (this.property.property_sector_details && this.property.property_sector_details[j].sector_detail && this.property.property_sector_details[j].sector_detail.id == this.sector_char_list[i].id) {
                                    value = true;
                                    continue;
                                }
                            }
                            this.item_sector_char_list[i] = {
                                'id': this.sector_char_list[i].id,
                                'name': this.sector_char_list[i].name,
                                'value': value
                            };
                        }

                        this.idStatusFilter.setValue({ id: this.property.status, name: this.property.status_name });
                        this.idTypeFilter.setValue({ id: this.property.type, name: this.property.type_name });
                        this.idPropertyOnFilter.setValue({
                            id: this.property.property_on,
                            name: this.property.property_on_name
                        });
                        this.idLocationFilter.setValue({
                            id: this.property.location,
                            name: this.property.location_name
                        });
                        this.idSectorFilter.setValue({
                            id_sector: this.property.sector,
                            sector: this.property.sector_name
                        });
                        this.idUnitFilter.setValue({ id: this.property.unit, name: this.property.unit_name });
                        this.idStratumsFilter.setValue({ id: this.property.id_stratum, name: this.property.stratum });

                        if (property.consultant) {
                            this.idConsultantFilter.setValue({
                                id: this.property.consultant,
                                name: this.property.consultant_name
                            });
                        }

                        if (property.owner) {
                            this.idOwnerFilter.setValue({ id: this.property.owner, name: this.property.owner_name });
                        }

                        this._sectorsService.getItemsFilteredBy(this.property.id_location)
                            .subscribe(
                            res => {
                                if (res) {
                                    this._sectorsService.sector_list = res.data;
                                    this.sector_list = this._sectorsService.sector_list;
                                    this.reactiveSectors = this.idSectorFilter.valueChanges
                                        .startWith(this.idSectorFilter.value)
                                        .map(val => this.displaySector(val))
                                        .map(name => this.filterSectorsAutocomplete(name, this.sector_list));
                                }
                            },
                            error => console.log(error)
                            );

                        this.propertyLoaded = true;
                    }

                },
                error => console.log(error)
                );

        } else {
            this.addingProperty = true;
            this.previewImages = [];
            this.principalImagePreview = [];
            this.fileNotImage = false;

            let i;

            for (i = 0; i < this.internal_char_list.length; i++) {
                this.item_internal_char_list[i] = {
                    'id': this.internal_char_list[i].id,
                    'name': this.internal_char_list[i].name,
                    'value': false
                };
            }

            for (i = 0; i < this.external_char_list.length; i++) {
                this.item_external_char_list[i] = {
                    'id': this.external_char_list[i].id,
                    'name': this.external_char_list[i].name,
                    'value': false
                };
            }

            for (i = 0; i < this.sector_char_list.length; i++) {
                this.item_sector_char_list[i] = {
                    'id': this.sector_char_list[i].id,
                    'name': this.sector_char_list[i].name,
                    'value': false
                };
            }

            this.propertyLoaded = true;
        }

    }

    // Funcion para abrir el dialog para ingresar/editar propiedades
    openConfirmDialog(data: any) {
        this.confirmConfig.data = data;
        this.confirmRef = this.dialog.open(ConfirmComponent, this.confirmConfig);
        this.confirmRef.afterClosed().subscribe(result => {
            this.lastCloseResult = result;
            this.confirmRef = null;
        });
    }

    displayLocation(value: any): string {
        if (value && typeof value === 'object') {
            this.filterSectors(value);
        }
        return value && typeof value === 'object' ? value.name : value;
    }

    filterSectors(value: Location) {

        if (value && typeof value === 'object' && this.last_location_value !== value) {
            this.last_location_value = value;
            this.sector_list = [{ id: 1, id_location: 0, id_sector: 0, sector: 'Cargando...' }];
            this.idSectorFilter.reset();
            this.reactiveSectors = this.idSectorFilter.valueChanges
                .startWith(this.idSectorFilter.value)
                .map(val => this.displaySector(val))
                .map(name => this.filterSectorsAutocomplete(name, this.sector_list));
            this._sectorsService.getItemsFilteredBy(value.id)
                .subscribe(
                res => {
                    if (res) {
                        this._sectorsService.sector_list = res.data;
                        this.sector_list = this._sectorsService.sector_list;
                        this.reactiveSectors = this.idSectorFilter.valueChanges
                            .startWith(this.idSectorFilter.value)
                            .map(val => this.displaySector(val))
                            .map(name => this.filterSectorsAutocomplete(name, this.sector_list));
                    }
                },
                error => console.log(error)
                );
        }
    }

    filterSectorsAutocomplete(val: string, list: any) {
        if (val) {
            // val = val.replace(/[^a-z\d\s\/\-]+/gi, '');
            val = val.replace(/[^a-z\d\s\u00C0-\u017F]+/gi, '');

        }
        if (val && list.filter((s) => s.sector.match(new RegExp(val, 'gi'))).length == 0) {
            this.addSector = true;
        }
        else {
            this.addSector = false;
        }
        return val ? list.filter((s) => s.sector.match(new RegExp(val, 'gi'))) : list;
    }
    filterConsultStates(val: string, list: any) {
        if (val) {
            val = val.replace(/[^a-z\d\s]+/gi, '');
        }
        if (val && list.filter((s) => s.name.match(new RegExp(val, 'gi'))).length == 0) {
            this.addConsult = true;
        }
        else {
            this.addConsult = false;
        }
        return val ? list.filter((s) => s.name.match(new RegExp(val, 'gi'))) : list;
    }

    filterOwnerStates(val: string, list: any) {
        if (val) {
            val = val.replace(/[^a-z\d\s]+/gi, '');
        }
        if (val && list.filter((s) => s.name.match(new RegExp(val, 'gi'))).length == 0) {
            this.addOwner = true;
        }
        else {
            this.addOwner = false;
        }
        return val ? list.filter((s) => s.name.match(new RegExp(val, 'gi'))) : list;
    }

    // Funcion para mostrar los resultados de la busqueda en los autocomplete
    displayFn(value: any): string {
        return value && typeof value === 'object' ? value.name : value;
    }

    displaySector(value: any): string {
        return value && typeof value === 'object' ? value.sector : value;
    }

    // Funcion para filtrar los valores en el autocomplete
    filterStates(val: string, list: any) {
        val = val.replace(/[^a-z\d\s]+/gi, '');

        return val ? list.filter((s) => s.name.match(new RegExp(val, 'gi'))) : list;
    }


    changeCharValue(list: any, index: number) {
        this.propertiesForm.controls['property_internal_details'].markAsTouched();
        list[index].value = !list[index].value;
    }

    addEdit(value: any) {

        if (this.propertiesForm.invalid || this.propertiesForm.untouched) {
            Object.keys(this.propertiesForm.controls).forEach(key => {
                this.propertiesForm.get(key).markAsDirty();
                this.propertiesForm.updateValueAndValidity();
            });
            this.showErrors = true;

        } else {

            let i;

            if (this.property_images.value.length > 0) {
                let count = this.property_images.value.length;
                for (i = 0; i <= count; i++) {
                    this.property_images.removeAt(0);
                }
            }

            if (this.property_internal_details.value.length > 0) {
                let count = this.property_internal_details.value.length;
                for (i = 0; i <= count; i++) {
                    this.property_internal_details.removeAt(0);
                }
            }

            for (i = 0; i < this.internal_char_list.length; i++) {
                if (this.item_internal_char_list.length > 0 && this.item_internal_char_list[i].value) {
                    this.property_internal_details.push(new FormControl({ id: this.internal_char_list[i].id }));
                }
            }

            if (this.property_external_details.value.length > 0) {
                let count = this.property_external_details.value.length;
                for (i = 0; i <= count; i++) {
                    this.property_external_details.removeAt(0);
                }
            }

            for (i = 0; i < this.external_char_list.length; i++) {
                if (this.item_external_char_list.length > 0 && this.item_external_char_list[i].value) {
                    this.property_external_details.push(new FormControl({ id: this.external_char_list[i].id }));
                }
            }

            if (this.property_sector_details.value.length > 0) {
                let count = this.property_sector_details.value.length;
                for (i = 0; i <= count; i++) {
                    this.property_sector_details.removeAt(0);
                }
            }

            for (i = 0; i < this.sector_char_list.length; i++) {
                if (this.item_sector_char_list.length > 0 && this.item_sector_char_list[i].value) {
                    this.property_sector_details.push(new FormControl({ id: this.sector_char_list[i].id }));
                }
            }

            for (i = 0; i < this.previewImages.length; i++) {
                if (this.previewImages[i].id) {
                    this.property_images.push(new FormControl({ id: this.previewImages[i].id }));
                } else {
                    this.property_images.push(new FormControl({ data: this.previewImages[i].dataUrlImage }));
                }
            }

            // Esta es la estructura de Property
            const property = {
                type: value.type ? value.type.id : null,
                property_on: value.property_on ? value.property_on.id : null,
                location: value.location ? value.location.id : null,
                sector: value.sector ? value.sector.id_sector : null,
                area: value.area ? value.area : null,
                unit: value.unit ? value.unit.id : null,
                price: value.price ? value.price : null,
                status: value.status ? value.status.id : null,
                built_area: value.built_area ? value.built_area : null,
                address: value.address ? value.address : "",
                images: this.property_images.value ? this.property_images.value : [],
                owner: value.owner ? value.owner.id : null,
                administration: value.administration ? value.administration : null,
                commission: value.commission ? value.commission : null,
                stratum: value.stratum ? value.stratum.id : null,
                comments: value.comments ? value.comments : "",
                admon_comments: value.admon_comments ? value.admon_comments : "",
                consultant: value.consultant ? value.consultant.id : null,
                baths: value.baths ? value.baths : null,
                rooms: value.rooms ? value.rooms : null,
                livings: value.livings ? value.livings : null,
                floors: value.floors ? value.floors : null,
                parkings: value.parkings ? value.parkings : null,
                property_internal_details: this.property_internal_details.value ? this.property_internal_details.value : [],
                property_external_details: this.property_external_details.value ? this.property_external_details.value : [],
                property_sector_details: this.property_sector_details.value ? this.property_sector_details.value : [],
                id_holder: this.userId,
                sector_name: value.sector ? value.sector.sector : "",
                publish: value.publish ? value.publish : null,
                sharing: value.sharing ? value.sharing : null,
                shared: value.shared ? value.shared : null,
                id_holder_property: value.id_holder_property ? value.id_holder_property : null,
                id: value.id ? value.id : null,
                image: null,
                position_image: this.positionImage ? this.positionImage : null,
                property_registration: value.property_registration ? value.property_registration : null,
                id_property_appropiate: value.id_property_appropiate ? value.id_property_appropiate : null
            };

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

                this._propertiesService.updateItem(property)
                    .subscribe(
                    res => {
                        this.dialogRef.close(res[0]);
                        this.confirmRef.close();
                    },
                    error => console.log(error)
                    );
            } else {

                this._propertiesService.insertItem(property)
                    .subscribe(
                    res => {
                        this.dialogRef.close(res[0]);
                        this.confirmRef.close();
                    },
                    error => console.log(error)
                    );
            }

        }

    }

    onSelectImage(fileInput: any) {
        this.propertiesForm.controls['images'].markAsTouched();
        console.log(this.previewImages);
        var divImageHolder = document.getElementById('divImageHolder');
        var files = fileInput.target.files;
        var fL = files.length;

        if (fL == 0) {

        }
        else {

            if (files) {
                var validateType = true;
                var i;
                var addPreviews = 20 - this.previewImages.length;

                if (fL < addPreviews) {
                    addPreviews = fL;
                }

                for (i = 0; i < addPreviews; i++) {
                    if (files.hasOwnProperty(i)) {
                        if (!files[i].type.match(/image.*/)) {
                            this.fileNotImage = true;
                            this.images.nativeElement.value = "";
                            validateType = false;
                        }
                    }
                }

                if (validateType) {
                    const data = {
                        subtitle: 'Redimensionando imágenes...',
                        ok: false,
                        cancel: false
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


                    var countIter = 0;
                    this.resizingImages = true;

                    for (i = 0; i < addPreviews; i++) {
                        if (files.hasOwnProperty(i)) {
                            this._zone.runOutsideAngular(() => {
                                this._imagesService.imageResizing((value) => {
                                    this._zone.run(() => {
                                        if (value == false) {
                                            this.fileNotImage = true;
                                            this.images.nativeElement.value = "";
                                        }
                                        else {
                                            countIter += 1;
                                            const previewInfo = {
                                                dataUrlImage: value.dataUrlImage,
                                                url: null,
                                                position: null
                                            };
                                            this.previewImages.push(previewInfo);
                                            this.fileNotImage = false;
                                            if (this.principalImagePreview.img == null) {
                                                this.principalImagePreview.img = this.previewImages[0].dataUrlImage;
                                                this.principalImagePreview.index = 0;
                                                this.previewImages[0].position = 1;
                                            }
                                            this.images.nativeElement.value = "";
                                            if (countIter == addPreviews) {
                                                this.confirmRef.close();
                                                const position = {
                                                    top: '',
                                                    bottom: '',
                                                    left: '',
                                                    right: ''
                                                };
                                                this.dialogRef.updateSize('80vw');
                                                this.dialogRef.updatePosition(position);
                                            }
                                        }
                                    });

                                }, files[i]);
                            });

                        }
                    }

                }
            }
        }

    }

    changePrincipalImage(index: number) {
        this.propertiesForm.controls['images'].markAsTouched();
        this.positionImage = index + 1;
        this.principalImagePreview.img = this.previewImages[index].dataUrlImage;
    }

    deleteImagePreview(index: number) {
        this.propertiesForm.controls['images'].markAsTouched();
        let principalImagePosition = this.positionImage - 1;

        if (principalImagePosition == index) {
            this.previewImages.splice(index, 1);
            if (this.previewImages[0]) {
                this.positionImage = 1;
                this.principalImagePreview.img = this.previewImages[0].dataUrlImage;
            }
        } else {
            if (index !== principalImagePosition) {
                if (index < principalImagePosition) {
                    this.previewImages.splice(index, 1);
                    this.positionImage = this.positionImage - 1;
                }
                if (index > principalImagePosition) {
                    this.previewImages.splice(index, 1);
                }
            }
        }

        if (this.previewImages.length === 0) {
            this.principalImagePreview.img = null;
        }
    }

    addNewSector(id_location: number, name: string) {
        this.addingSector = true;
        const sector = {
            id_location: id_location,
            name: name
        }
        this._sectorsService.insertItem(sector)
            .subscribe(
            res => {
                this.addingSector = false;
                this._sectorsService.sector_list.push({
                    id: res.id,
                    id_location: res.id_location,
                    id_sector: res.id_sector,
                    sector: name
                });
                this.sector_list = this._sectorsService.sector_list;
                this.idSectorFilter.setValue({ id_sector: res.id_sector, sector: name });
                this.reactiveSectors = this.idSectorFilter.valueChanges
                    .startWith(this.idSectorFilter.value)
                    .map(val => this.displaySector(val))
                    .map(name => this.filterSectorsAutocomplete(name, this.sector_list));
            },
            error => console.log(error)
            );
    }
    focusOutConsultantFunction() {
        var self = this;
        setTimeout(function () {
            if (self.addingConsult) { }
            else {
                var isExist = false;
                if (typeof (self.detailConsultant) == "object") {
                    return;
                }
                var isSame = false;
                for (var i = 0; i < self._consultantsService.consultant_list.length; i++) {
                    var item = self._consultantsService.consultant_list[i];
                    var strItem = item.name;
                    if (strItem == self.detailOwner) {
                        isSame = true;
                        return;
                    }
                    else {
                        isSame = false;
                    }
                }
                console.log("timeout", isSame);
                if (!isSame) {
                    self.detailConsultant = "";
                }
            }
        }, 1000);
    }
    addNewConsult(name: string) {
        this.addingConsult = true;
        var consult = new Consultant(0, name, 0, "");

        this._consultantsService.insertItem(consult)
            .subscribe(
            res => {
                this.addingConsult = false;
                this.addConsult = false;
                this._consultantsService.consultant_list.push({
                    id: 0,
                    name: name,
                    phone: 0,
                    email: ""
                });
                this.consultant_list = this._consultantsService.consultant_list;
            },
            error => console.log(error)
            );
    }
    focusOutOwnerFunction() {
        var self = this;
        setTimeout(function () {
            if (self.addingOwner) { }
            else {
                var isExist = false;
                if (typeof (self.detailOwner) == "object") {
                    return;
                }
                console.log(self.detailOwner);
                var isSame = false;
                for (var i = 0; i < self._ownersService.owner_list.length; i++) {
                    var item = self._ownersService.owner_list[i];
                    var strItem = item.name;
                    if (strItem == self.detailOwner) {
                        isSame = true;
                        return;
                    }
                    else {
                        isSame = false;
                    }
                }
                console.log("timeout", isSame);
                if (!isSame) {
                    self.detailOwner = "";
                }
            }
        }, 1000);
    }
    addNewOwner(name: string) {
        console.log("Add");
        this.addingOwner = true;

        var owner = new Owner(0, name, "", 0, 0, 0, null);

        this._ownersService.insertItem(owner)
            .subscribe(
            res => {
                this.addingOwner = false;
                this.addOwner = false;
                this._ownersService.owner_list.push({
                    id: 0,
                    name: name,
                    email: "",
                    document: 0,
                    phone1: 0,
                    phone2: 0,
                    date: null
                });
                this.owner_list = this._ownersService.owner_list;
            },
            error => console.log(error)
            );

    }
}
