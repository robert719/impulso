import {PropertyOn} from "./propertyOn";
import "rxjs/Rx";
import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {GlobalsService} from "./globals.service";
import { AuthHttp } from 'angular2-jwt';

@Injectable()

export class PropertiesOnService {

    public propertyOn_list: PropertyOn[] = [];
    private ApiUrl: string;

    constructor(private _http: Http, private _globalsService: GlobalsService, public authHttp: AuthHttp) {
        this.ApiUrl = this._globalsService.ApiUrl;
    }

    getAllItems(): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
        return this._http.get('ajax/propertiesOn.php' + token)
            .map(response => response.json());
    }

    getItems(page: number): Observable<any> {
        return this.authHttp.post(this.ApiUrl + '/property_on/list', {page: page}).map(response => response.json());
    }

    getItemsFilteredBy(row: string, index: any): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.get('ajax/propertiesOn.php?row=' + row + '&id=' + index + token)
            .map(response => response.json());
    }

    getItem(index: number): PropertyOn {
        return;
        // return this.product_list[index];
    }

    getIndexOfItem(item: PropertyOn) {
        return this.propertyOn_list.indexOf(item);
    }

    insertItem(item: PropertyOn): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
        const body = JSON.stringify(item);
        const headers = new Headers();
        headers.append("Content-type", "application/json");
        return this._http.post('ajax/propertiesOn.php' + token, body, { headers: headers })
            .map(response => response.json());
    }

    insertItems(item: PropertyOn[]) {

    }

    deleteItem(index: number) {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.delete('ajax/propertiesOn.php?id=' + index + token)
            .map(response => response.json());
    }

    updateItem(item: PropertyOn): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
        const body = JSON.stringify(item);
        const headers = new Headers();
        headers.append("Content-type", "application/json");
        return this._http.put('ajax/propertiesOn.php' + token, body, { headers: headers })
            .map(response => response.json());
    }
}
