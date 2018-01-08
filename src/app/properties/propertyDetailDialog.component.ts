import {Component, OnInit, Inject} from '@angular/core';
import {MD_DIALOG_DATA} from '@angular/material';
import {MdDialogRef} from '@angular/material';

import 'rxjs/add/operator/startWith';


import {PropertiesService} from '../services/properties.service';
import {OwnersService} from '../services/owners.service';
import {ConsultantsService} from '../services/consultants.service';
import {AuthService} from "../services/auth.service";

declare var $: any;
declare var fotorama: any;

@Component({
    templateUrl: 'propertyDetailDialog.component.html',
    styleUrls: ['propertyDetailDialog.component.scss'],
    providers: [PropertiesService, OwnersService, ConsultantsService, AuthService]
})
export class PropertyDetailDialogComponent implements OnInit {

    userId: any;
    property;
    propertyLoaded = false;

    owner_name: any;
    owner_document: any;
    owner_email: any;
    owner_phone1: any;
    owner_phone2: any;

    consultant_name: string;
    consultant_phone: string;
    consultant_email: string;

    downlineName: any;
    downlineAddress: any;
    downlineCellphone: any;
    downlinePhone: any;
    downlineEmail: any;
    downlineNit: any;
    downlineLogo: any;
    downlineWebsite: any;

    constructor(private _propertiesService: PropertiesService,
                private _ownersService: OwnersService,
                private _consultantsService: ConsultantsService,
                private _authService: AuthService,
                public dialogRef: MdDialogRef<PropertyDetailDialogComponent>,
                @Inject(MD_DIALOG_DATA) public item: any) {
    }

    ngOnInit() {

        this.userId = localStorage.getItem('userId');

        this._propertiesService.getFile(this.item.id)
            .subscribe(
                response => {
                    const userId = this.userId;
                    this.property = response[0];
                    const property = this.property;
                    const propertyImages = property.images;
                    let id_holder;
                    let id_holder_property;
                    let fotoramaHolder;
                    if (property.shared === 1) {
                        id_holder = property.id_holder;
                        id_holder_property = property.id_holder_property;
                    } else {
                        id_holder = userId;
                        id_holder_property = property.id;
                    }

                    if (propertyImages.length > 0) {
                        fotoramaHolder = '<div class="fotorama"' +
                            ' id="idDivFotorama" ' +
                            ' data-maxheight="50%"' +
                            /* 'data-nav="thumbs" ' + */
                            'data-allowfullscreen="true" ' +
                            'data-loop="true" ' +
                            'data-autoplay="true" ' +
                            'data-keyboard="true" ' +
                            'data-arrows="true">' +
                            '<img src="https://s3-us-west-2.amazonaws.com/inmobiliarias/' +
                            id_holder +
                            '/images/properties/' +
                            id_holder_property +
                            '/large/' +
                            property.image_url +
                            '"> ';

                        $.each(propertyImages, function (key, val) {
                            if (val.url !== property.image_url) {
                                fotoramaHolder = fotoramaHolder +
                                    '<img src="https://s3-us-west-2.amazonaws.com/inmobiliarias/' +
                                    id_holder +
                                    '/images/properties/' +
                                    id_holder_property +
                                    '/large/' +
                                    val.url +
                                    '" data-full="https://s3-us-west-2.amazonaws.com/inmobiliarias/' +
                                    id_holder +
                                    '/images/properties/' +
                                    id_holder_property +
                                    '/large/' +
                                    val.url +
                                    '" >';
                            }
                        });

                        fotoramaHolder = fotoramaHolder + '</div>';

                    }
                    setTimeout(function () {
                        $('#idDivFotoramaHolder').html(fotoramaHolder);
                        $('#idDivFotorama').fotorama();
                    }, 500);

                    if (property.shared !== 1 && property.owner) {
                        this._ownersService.getItem(property.id_owner)
                            .subscribe(
                                res => {
                                    const owner = res;
                                    if (owner) {
                                        console.log(owner);
                                        this.owner_name = owner.name;
                                        this.owner_document = owner.document;
                                        this.owner_email = owner.email;
                                        this.owner_phone1 = owner.phone1;
                                        this.owner_phone2 = owner.phone2;
                                    }
                                },
                                error => console.log(error)
                            );
                    }

                    if (property.shared !== 1 && property.consultant) {

                        this._consultantsService.getItem(property.id_consultant)
                            .subscribe(
                                consultantsRes => {
                                    const consultant = consultantsRes;
                                    if (consultant) {
                                        console.log(consultant);
                                        this.consultant_name = consultant.name;
                                        this.consultant_phone = consultant.phone;
                                        this.consultant_email = consultant.email;
                                    }
                                },
                                error => console.log(error)
                            );
                    }

                    if (property.shared === 1) {
                        console.log('voy a traer los detalles de la empresa');
                        this._authService.getCompanyDetail(property.id_holder)
                            .subscribe(
                                downlineRes => {
                                    const downline = downlineRes;
                                    if (downline) {
                                        console.log(downline);
                                        this.downlineName = downline.name;
                                        this.downlineAddress = downline.address;
                                        this.downlineCellphone = downline.contact_cellphone;
                                        this.downlinePhone = downline.contact_phone;
                                        this.downlineEmail = downline.contact_email;
                                        this.downlineNit = downline.nit;
                                        this.downlineLogo = downline.logo;
                                        this.downlineWebsite = downline.website;
                                    }
                                },
                                error => console.log(error)
                            );
                    }

                    this.propertyLoaded = true;
                    console.log(this.property);
                },
                error => console.log(error)
            );
    }

}
