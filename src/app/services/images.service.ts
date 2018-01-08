import "rxjs/Rx";
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

// libreria de load-image.all.min.js para exif de las imágenes y orientación correcta.
declare var loadImage: any;

@Injectable()

export class ImagesService {
    // Token para la información de la bd
    token: any;

    // public product_list: Product[] = [];

    constructor(private _http: Http) {
        this.token = localStorage.getItem('token');
    }

    imageResizing(doneCallback: (value) => any, file) {
        loadImage.parseMetaData(file, function(data) {
            if (data.exif) {
                var ori = data.exif.get('Orientation');
            }
            var loadingImage = loadImage(
                file,
                function(img) {
                    var dataUrl;
                    // img.getContext('2d').drawImage(img, 0, 0, width, height);
                    if (file.type == "image/png") {
                        dataUrl = img.toDataURL('image/png', 0.8);
                    }
                    else {
                        dataUrl = img.toDataURL('image/jpeg', 0.8);
                    }
                    const value = {
                        dataUrlImage: dataUrl
                    };
                    doneCallback(value);
                }, {
                    maxWidth: 1920,
                    maxHeight: 1080,
                    canvas: true,
                    orientation: ori
                }
                );

                if(!loadingImage) {
                  doneCallback(false);
                }
        });
    }

    makeFileRequest(url: string, params: Array<string>, files: any) {
        return new Promise((resolve, reject) => {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();
            formData.append("uploads[]", files);
            formData.append("token", this.token);
            // for (var i = 0; i < files.length; i++) {
            //     formData.append("uploads[]", files[i], files[i].name);
            // }
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.open("POST", url, true);
            xhr.send(formData);
        });
    }

    deleteImage(image: string) {
        const token = this.token !== null ? '&token=' + this.token : '';
        return this._http.delete('ajax/images.php?image=' + image + token)
            .map(response => response.json());
    }

    // getAllItems(): Observable<any> {
    //     const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
    //     return this._http.get('ajax/products.php' + token)
    //         .map(response => response.json());
    // }
    //
    // getItems(index: any): Observable<any> {
    //     const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
    //     return this._http.get('ajax/products.php?id=' + index + token)
    //         .map(response => response.json());
    // }
    //
    // getItemsFilteredBy(name: string, column: string, id: any): Observable<any> {
    //     const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
    //     return this._http.get('ajax/products.php?search=true&column=' + column + '&name=' + name + '&id=' + id + token)
    //         .map(response => response.json());
    // }
    //
    // getItem(index: number): Observable<any> {
    //     const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
    //     return this._http.get('ajax/products.php?index=' + index + token)
    //         .map(response => response.json());
    // }
    //
    // getIndexOfItem(item: Product) {
    //     return this.product_list.indexOf(item);
    // }
    //
    // insertItem(item: Product): Observable<any> {
    //     const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
    //     const body = JSON.stringify(item);
    //     const headers = new Headers();
    //     headers.append("Content-Type", "application/json");
    //     return this._http.post('ajax/products.php' + token, body, { headers: headers })
    //         .map(response => response.json());
    // }
    //
    // insertItems(item: Product[]) {
    //     const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
    //
    // }
    //
    // deleteItem(index: number) {
    //     const token = localStorage.getItem('token') !== null ? '&token=' + localStorage.getItem('token') : '';
    //     return this._http.delete('ajax/products.php?id=' + index + token)
    //         .map(response => response.json());
    // }
    //
    // updateItem(item: Product): Observable<any> {
    //     const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
    //     const body = JSON.stringify(item);
    //     const headers = new Headers();
    //     headers.append("Content-Type", "application/json");
    //     return this._http.put('ajax/products.php' + token, body, { headers: headers })
    //         .map(response => response.json());
    // }
    // printProducts(): Observable<any> {
    //     const token = localStorage.getItem('token') !== null ? '?token=' + localStorage.getItem('token') : '';
    //     return this._http.get('ajax/productsexport.php' + token)
    //         .map(response => response.json());
    // }
}

var dataURLToBlob = function(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = parts[1];

        return new Blob([raw], { type: contentType });
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw: any = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}
