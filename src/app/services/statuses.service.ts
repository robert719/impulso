import {Status} from "./status";
import "rxjs/Rx";
import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {GlobalsService} from "./globals.service";
import { AuthHttp } from 'angular2-jwt';

@Injectable()

export class StatusesService {

    public status_list: Status[] = [];
    private ApiUrl: string;

    constructor(private _http: Http, private _globalsService: GlobalsService, public authHttp: AuthHttp) {
        this.ApiUrl = this._globalsService.ApiUrl;
    }

    getAllItems(): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
        return this._http.get('ajax/statuses.php' + token)
            .map(response => response.json());
    }

    getItems(page: number): Observable<any> {
        return this.authHttp.post(this.ApiUrl + '/property_status/list', {page: page}).map(response => response.json());
    }


    getItemsFilteredBy(row: string, index: any): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.get('ajax/statuses.php?row=' + row + '&id=' + index + token)
            .map(response => response.json());
    }

    getItem(index: number): Status {
        return;
        // return this.product_list[index];
    }

    getIndexOfItem(item: Status) {
        return this.status_list.indexOf(item);
    }

    insertItem(item: Status): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
        const body = JSON.stringify(item);
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        return this._http.post('ajax/statuses.php' + token, body, { headers: headers })
            .map(response => response.json());
    }

    insertItems(item: Status[]) {

    }

    deleteItem(index: number) {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.delete('ajax/statuses.php?id=' + index + token)
            .map(response => response.json());
    }

    updateItem(item: Status): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
        const body = JSON.stringify(item);
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        return this._http.put('ajax/statuses.php' + token, body, { headers: headers })
            .map(response => response.json());
    }
}
