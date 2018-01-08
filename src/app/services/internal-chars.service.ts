import {InternalChar} from "./internal-char";
import 'rxjs/Rx';
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs';
import {GlobalsService} from './globals.service';
import { AuthHttp } from 'angular2-jwt';

@Injectable()

export class InternalCharsService {

    public internal_char_list: InternalChar[] = [];
    private ApiUrl: string;

    constructor(private _http: Http, private _globalsService: GlobalsService, public authHttp: AuthHttp) {
        this.ApiUrl = this._globalsService.ApiUrl;
    }

    getAllItems(): Observable<any> {
        return this.authHttp.post(this.ApiUrl + '/internal_details/list', {}).map(response => response.json());
    }

/*    getItems(page: number): Observable<any> {
        return this.authHttp.post(this.ApiUrl + '/api/properties/list', {page: page}).map(response => response.json());
    }

    getItemsFilteredBy(row: string, index: any): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.get('ajax/internalChars.php?row=' + row + '&id=' + index + token)
            .map(response => response.json());
    }

    getItem(index: number): InternalChar {
        return;
        // return this.product_list[index];
    }

    getIndexOfItem(item: InternalChar) {
        return this.internal_char_list.indexOf(item);
    }

    insertItem(item: InternalChar): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
        const body = JSON.stringify(item);
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        return this._http.post('ajax/internalChars.php' + token, body, { headers: headers })
            .map(response => response.json());
    }

    insertItems(item: InternalChar[]) {

    }

    deleteItem(index: number) {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.delete('ajax/internalChars.php?id=' + index + token)
            .map(response => response.json());
    }

    updateItem(item: InternalChar): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
        const body = JSON.stringify(item);
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        return this._http.put('ajax/internalChars.php' + token, body, { headers: headers })
            .map(response => response.json());
    }*/
}
