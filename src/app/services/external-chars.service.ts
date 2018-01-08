import {ExternalChar} from "./external-char";
import "rxjs/Rx";
import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {GlobalsService} from "./globals.service";
import { AuthHttp } from 'angular2-jwt';

@Injectable()

export class ExternalCharsService {

    public external_char_list: ExternalChar[] = [];
    private ApiUrl: string;

    constructor(private _http: Http, private _globalsService: GlobalsService, public authHttp: AuthHttp) {
        this.ApiUrl = this._globalsService.ApiUrl;
    }

    getAllItems(): Observable<any> {
        return this.authHttp.post(this.ApiUrl + '/external_details/list', {}).map(response => response.json());
    }

/*
    getItems(index: any): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.get('ajax/externalChars.php?id=' + index + token)
            .map(response => response.json());
    }

    getItemsFilteredBy(row: string, index: any): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.get('ajax/externalChars.php?row=' + row + '&id=' + index + token)
            .map(response => response.json());
    }

    getItem(index: number): ExternalChar {
        return;
        // return this.product_list[index];
    }

    getIndexOfItem(item: ExternalChar) {
        return this.external_char_list.indexOf(item);
    }

    insertItem(item: ExternalChar): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
        const body = JSON.stringify(item);
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        return this._http.post('ajax/externalChars.php' + token, body, { headers: headers })
            .map(response => response.json());
    }

    insertItems(item: ExternalChar[]) {

    }

    deleteItem(index: number) {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.delete('ajax/externalChars.php?id=' + index + token)
            .map(response => response.json());
    }

    updateItem(item: ExternalChar): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
        const body = JSON.stringify(item);
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        return this._http.put('ajax/externalChars.php' + token, body, { headers: headers })
            .map(response => response.json());
    }*/
}
