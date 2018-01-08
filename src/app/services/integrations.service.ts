import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs/Observable";
import {GlobalsService} from "./globals.service";
import {AuthHttp} from 'angular2-jwt';

@Injectable()

export class IntegrationsService {
    private ApiUrl: string;
    public neighborhood_list: any;

    constructor(private _http: Http, private _globalsService: GlobalsService, public authHttp: AuthHttp) {
        this.ApiUrl = this._globalsService.ApiUrl;
    }

    getNeighborhoods(id_city: number): Observable<any> {
        return this.authHttp.get(this.ApiUrl + '/integrations/appropiate/cities/' + id_city + '/neighborhoods').map(response => response.json());
    }

    getAgents(): Observable<any> {
        return this.authHttp.get(this.ApiUrl + '/integrations/appropiate/agents').map(response => response.json());
    }

    getIntegrations(): Observable<any> {
        return this.authHttp.get(this.ApiUrl + '/integrations/integrated-systems').map(response => response.json());
    }

    activateIntegration(login: any): Observable<any> {
        let data = {
            "integratedSystem": {
                "external_system_code": "APPROPIATE"
            },
            "externalAuthentication": {
                "external_system_code": "APPROPIATE",
                "username": login.username,
                "password": login.password
            }
        };
        return this.authHttp.post(this.ApiUrl + '/integrations/integrated-systems', data).map(response => response.json());
    }

    updateIntegration(index: number, status: number): Observable<any> {
        let data = {
            "external_system_code": "APPROPIATE",
            "status": status
        };
        return this.authHttp.put(this.ApiUrl + '/integrations/integrated-systems/' + index, data).map(response => response.json());
    }

    updateAuthentication(index: number, login: any): Observable<any> {
        let data = {
            "external_system_code": "APPROPIATE",
            "username": login.username,
            "password": login.password
        }
        return this.authHttp.put(this.ApiUrl + '/integrations/external-authentications/' + index, data).map(response => response.json());
    }

    getMappedObject(data: any): Observable<any> {
        let request = {
            "externalSystemCode": data.externalSystemCode,
            "internalObjectName": data.internalObjectName,
            "internalObjectCode": data.internalObjectCode
        };

        return this.authHttp.post(this.ApiUrl + '/integrations/object-mappings/by-external-system', request).map(response => response.json());
    }

    mapObject(data: any): Observable<any> {
        let request = {
            "external_system_code": data.external_system_code,
            "internal_object_name": data.internal_object_name,
            "external_object_name": data.external_object_name,
            "internal_object_code": data.internal_object_code,
            "external_object_code": data.external_object_code
        }

        return this.authHttp.post(this.ApiUrl + '/integrations/object-mappings', request).map(response => response.json());
    }

    shareAppropiate(data: any): Observable<any> {
        let request = {
            "id": data.id,
            "externalSystemCode": data.externalSystemCode
        }

        return this.authHttp.post(this.ApiUrl + '/integrations/properties', request).map(response => response.json());
    }

    deleteProperty(data: any): Observable<any> {
        let request = {
            "externalSystemCode": data.externalSystemCode
        }

        return this.authHttp.delete(this.ApiUrl + '/integrations/properties/' + data.id, {body: request}).map(response => response.json());
    }

}
