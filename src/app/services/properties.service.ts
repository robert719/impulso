import {Property} from './property';

import {Injectable} from '@angular/core';
import 'rxjs/Rx';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs';

import {AuthHttp} from 'angular2-jwt';
import {GlobalsService} from './globals.service';

@Injectable()

export class PropertiesService {

    public property_list: Property[] = [];
    private ApiUrl: string;

    constructor(private _http: Http, private _globalsService: GlobalsService, public authHttp: AuthHttp) {
        this.ApiUrl = this._globalsService.ApiUrl;
    }

    shareProperty(id: number): Observable<any> {
        return this.authHttp.get(this.ApiUrl + '/properties/share/' + id);
    }

    unshareProperty(id: number): Observable<any> {
        return this.authHttp.get(this.ApiUrl + '/properties/unshare/' + id);
    }

    getItems(page: number): Observable<any> {
        let gridState = {
            sort: {
                predicate: [
                    {
                        predicate: "properties.id",
                        reverse: true
                    }
                    ]
            }
        }
        return this.authHttp.post(this.ApiUrl + '/properties/list', {page: page, gridState : gridState}).map(response => response.json());
    }

    getItemsFilteredBy(attributes: any, page: number): Observable<any> {
        return this.authHttp.post(this.ApiUrl + '/properties/list', {
            gridState: attributes,
            page: page
        }).map(response => response.json());
    }

    getItem(index: number): Observable<any> {
        return this.authHttp.get(this.ApiUrl + '/properties/detail/' + index).map(response => response.json());
    }

    getItemFilteredByCode(code: string): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.get('ajax/properties.php?code=' + code + token)
            .map(response => response.json());
    }

    getFile(index: number): Observable<any> {
        return this.authHttp.get(this.ApiUrl + '/properties/detail/' + index).map(response => response.json());
    }

    getIndexOfItem(item: Property) {
        return this.property_list.indexOf(item);
    }

    insertItem(item: Property): Observable<any> {
        return this.authHttp.post(this.ApiUrl + '/properties', item).map(response => response.json());
    }

    insertItems(item: Property[]) {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';

    }

    deleteItem(index: number) {
        return this.authHttp.delete(this.ApiUrl + '/properties/'+index).map(response => response.json());
    }

    updateItem(item: Property): Observable<any> {
        return this.authHttp.put(this.ApiUrl + '/properties/' + item.id, item).map(response => response.json());
    }

    numericalStatistics(): Observable<any> {
        return this.authHttp.get(this.ApiUrl + '/properties/numerical-statistics').map(response => response.json());
    }

    numberForMonth(): Observable<any> {
        return this.authHttp.get(this.ApiUrl + '/properties/properties-number-for-month').map(response => response.json());
    }

    numberForPropertyType(): Observable<any> {
        return this.authHttp.get(this.ApiUrl + '/properties/properties-number-for-property-type').map(response => response.json());
    }

    printProducts(): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
        return this._http.get('ajax/productsexport.php' + token)
            .map(response => response.json());
    }
}
