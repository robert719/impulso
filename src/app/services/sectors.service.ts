import {Sector} from "./sector";
import "rxjs/Rx";
import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {GlobalsService} from "./globals.service";
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class SectorsService {

    public sector_list: Sector[] = [];
    private ApiUrl: string;

    constructor(private _http: Http, private _globalsService: GlobalsService, public authHttp: AuthHttp) {
        this.ApiUrl = this._globalsService.ApiUrl;
    }

    getAllItems(): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
        return this._http.get('ajax/sectors.php' + token)
            .map(response => response.json());
    }

    getItems(id: number, index: any): Observable<any> {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.get('ajax/sectors.php?id=' + id + '&limit=' + index + token)
            .map(response => response.json());
    }

    getItemsFilteredBy(id: number): Observable<any> {
        let gridState = {
            search: {
                predicateObject: {
                    id_location: id
                }
            },
            sort: {
                predicate: [
                    {
                        predicate: "sectors.name",
                        reverse: false
                    }
                ]
            },
        }
        return this.authHttp.post(this.ApiUrl + '/location_sectors/list', {
            gridState: gridState
        }).map(response => response.json());
    }

    getFilteredSectors(id_location: number, sector_name: string): Observable<any> {
        let gridState = {
            search: {
                predicateObject: {
                    id_location: id_location,
                    name: sector_name
                }
            },
            sort: {
                predicate: [
                    {
                        predicate: "sectors.name",
                        reverse: false
                    }
                ]
            },
        }
        return this.authHttp.post(this.ApiUrl + '/location_sectors/list', {
            gridState: gridState
        }).map(response => response.json());
    }

    getUsedSector(id_sector: number) {
        const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
        return this._http.get('ajax/sectors.php?search=true&used=true&id_sector=' + id_sector + token)
            .map(response => response.json());
    }

    getItem(index: number): Observable<any> {
        return this.authHttp.get(this.ApiUrl + '/sectors/' + index).map(response => response.json());
    }

    getIndexOfItem(item: Sector) {
        return this.sector_list.indexOf(item);
    }

    insertItem(item: any): Observable<any> {
        return this.authHttp.post(this.ApiUrl + '/sectors', item).map(response => response.json());
    }

    deleteItem(index: number): Observable<any> {
        return this.authHttp.delete(this.ApiUrl + '/sectors/' + index);
    }

    updateItem(item: Sector): Observable<any> {
        return this.authHttp.put(this.ApiUrl + '/sectors/' + item.id_sector, {name: item.sector}).map(response => response.json());
    }
}
