import {SectorChar} from "./sector-char";
import "rxjs/Rx";
import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {GlobalsService} from "./globals.service";
import { AuthHttp } from 'angular2-jwt';

@Injectable()

export class SectorCharsService {

    public sector_char_list: SectorChar[] = [];
    private ApiUrl: string;

    constructor(private _http: Http, private _globalsService: GlobalsService, public authHttp: AuthHttp) {
        this.ApiUrl = this._globalsService.ApiUrl;
    }

    getAllItems(): Observable<any> {
        return this.authHttp.post(this.ApiUrl + '/sector_details/list', {}).map(response => response.json());
    }

    /*getItems(index: any): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.get('ajax/sectorChars.php?id=' + index + token)
            .map(response => response.json());
    }

    getItemsFilteredBy(row: string, index: any): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.get('ajax/sectorChars.php?row=' + row + '&id=' + index + token)
            .map(response => response.json());
    }

    getItem(index: number): SectorChar {
        return;
        // return this.product_list[index];
    }

    getIndexOfItem(item: SectorChar) {
        return this.sector_char_list.indexOf(item);
    }

    insertItem(item: SectorChar): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
        const body = JSON.stringify(item);
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        return this._http.post('ajax/sectorChars.php' + token, body, { headers: headers })
            .map(response => response.json());
    }

    insertItems(item: SectorChar[]) {

    }

    deleteItem(index: number) {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.delete('ajax/sectorChars.php?id=' + index + token)
            .map(response => response.json());
    }

    updateItem(item: SectorChar): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
        const body = JSON.stringify(item);
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        return this._http.put('ajax/sectorChars.php' + token, body, { headers: headers })
            .map(response => response.json());
    }*/
}
