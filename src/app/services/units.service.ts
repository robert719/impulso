import {Unit} from "./unit";
import "rxjs/Rx";
import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()

export class UnitsService {

    public unit_list: Unit[] = [];

    constructor(private _http: Http) { }

    getAllItems(): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
        return this._http.get('ajax/units.php' + token)
            .map(response => response.json());
    }

    getItems(index: any): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.get('ajax/units.php?id=' + index + token)
            .map(response => response.json());
    }

    getItemsFilteredBy(row: string, index: any): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.get('ajax/units.php?row=' + row + '&id=' + index + token)
            .map(response => response.json());
    }

    getItem(index: number): Unit {
        return;
        // return this.product_list[index];
    }

    getIndexOfItem(item: Unit) {
        return this.unit_list.indexOf(item);
    }

    insertItem(item: Unit): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
        const body = JSON.stringify(item);
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        return this._http.post('ajax/units.php' + token, body, { headers: headers })
            .map(response => response.json());
    }

    insertItems(item: Unit[]) {

    }

    deleteItem(index: number) {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.delete('ajax/units.php?id=' + index + token)
            .map(response => response.json());
    }

    updateItem(item: Unit): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
        const body = JSON.stringify(item);
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        return this._http.put('ajax/units.php' + token, body, { headers: headers })
            .map(response => response.json());
    }
}
