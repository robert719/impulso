import {Type} from "./type";
import "rxjs/Rx";
import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import {GlobalsService} from "./globals.service";
import { AuthHttp } from 'angular2-jwt';

@Injectable()

export class TypesService {

    public type_list: Type[] = [];
    private ApiUrl: string;

    constructor(private _http: Http, private _globalsService: GlobalsService, public authHttp: AuthHttp) {
        this.ApiUrl = this._globalsService.ApiUrl;
    }

    getAllItems(): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
        return this._http.get('ajax/types.php' + token)
            .map(response => response.json());
    }

    getItems(page: number): Observable<any> {
        return this.authHttp.post(this.ApiUrl + '/types/list', {page: page}).map(response => response.json());
    }

    getItemsFilteredBy(row: string, index: any): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.get('ajax/types.php?row=' + row + '&id=' + index + token)
            .map(response => response.json());
    }

    getItem(index: number): Type {
        return;
        // return this.product_list[index];
    }

    getIndexOfItem(item: Type) {
        return this.type_list.indexOf(item);
    }

    insertItem(item: Type): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
        const body = JSON.stringify(item);
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        return this._http.post('ajax/types.php' + token, body, { headers: headers })
            .map(response => response.json());
    }

    insertItems(item: Type[]) {

    }

    deleteItem(index: number) {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.delete('ajax/types.php?id=' + index + token)
            .map(response => response.json());
    }

    updateItem(item: Type): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
        const body = JSON.stringify(item);
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        return this._http.put('ajax/types.php' + token, body, { headers: headers })
            .map(response => response.json());
    }
}
