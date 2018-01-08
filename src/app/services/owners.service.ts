import {Owner} from './owner';
import 'rxjs/Rx';
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs';

import { AuthHttp } from 'angular2-jwt';
import {GlobalsService} from './globals.service';

@Injectable()

export class OwnersService {

    public owner_list: Owner[] = [];
    public filtered_owner_list: Owner[] = [];
    private ApiUrl: string;

    constructor(private _http: Http, private _globalsService: GlobalsService, public authHttp: AuthHttp) {
        this.ApiUrl = this._globalsService.ApiUrl;
    }

    getItems(page: number): Observable<any> {
        let gridState = {
            sort: {
                predicate: [
                    {
                        predicate: "owners.name",
                        reverse: false
                    }
                ]
            }
        }
        return this.authHttp.post(this.ApiUrl + '/owners/list', {page: page, gridState: gridState}).map(response => response.json());
    }


    getItemsFilteredBy(attributes: any, page: number): Observable<any> {
        return this.authHttp.post(this.ApiUrl + '/owners/list', {
            gridState: attributes,
            page: page
        }).map(response => response.json());
    }

    getItem(index: number): Observable<any> {
        return this.authHttp.get(this.ApiUrl + '/owners/' + index).map(response => response.json());
    }

    getIndexOfItem(item: Owner) {
        return this.owner_list.indexOf(item);
    }

    insertItem(data: Owner): Observable<any> {
        return this.authHttp.post(this.ApiUrl + '/owners', data).map(response => response.json());
    }

    deleteItem(index: number): Observable<any> {
        return this.authHttp.delete(this.ApiUrl + '/owners/' + index);
    }

    updateItem(data: Owner): Observable<any> {
        return this.authHttp.put(this.ApiUrl + '/owners/' + data.id, data).map(response => response.json());
    }

/*    getUsedOwner(id_owner?: number) {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.get('ajax/owners.php?search=true&used=true&id_owner=' + id_owner + token)
            .map(response => response.json());
    }*/
}
