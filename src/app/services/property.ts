export class Property {
    id: number;
    image: string;
    images: Array<string>;
    price: number;
    property_on: number;
    sector: number;
    address: string;
    area: number;
    unit: number;
    publish: number;
    owner: number;
    status: number;
    built_area: number;
    administration: number;
    commission: number;
    stratum: number;
    comments: string;
    admon_comments: string;
    consultant: number;
    type: number;
    location: number;
    baths: number;
    rooms: number;
    livings: number;
    floors: number;
    parkings: number;
    property_internal_details: Array<any>;
    property_external_details: Array<any>;
    property_sector_details: Array<any>;
    sharing: number;
    shared: number;
    id_holder: number;
    id_holder_property: number;
    sector_name: string;
    id_property_appropiate: number;

    constructor(type: number,
                property_on: number,
                location: number,
                sector: number,
                area: number,
                unit: number,
                price: number,
                status: number,
                built_area?: number,
                address?: string,
                images?: Array<string>,
                owner?: number,
                administration?: number,
                commission?: number,
                stratum?: number,
                comments?: string,
                admon_comments?: string,
                consultant?: number,
                baths?: number,
                rooms?: number,
                livings?: number,
                floors?: number,
                parkings?: number,
                property_internal_details?: Array<any>,
                property_external_details?: Array<any>,
                property_sector_details?: Array<any>,
                id_holder?: number,
                sector_name?: string,
                publish?: number,
                sharing?: number,
                shared?: number,
                id_holder_property?: number,
                id?: number,
                image?: string,
                id_property_appropiate?: number) {
        this.id = id;
        this.image = image;
        this.images = images;
        this.price = price;
        this.property_on = property_on;
        this.type = type;
        this.location = location;
        this.sector = sector;
        this.address = address;
        this.area = area;
        this.unit = unit;
        this.publish = publish;
        this.owner = owner;
        this.status = status;
        this.built_area = built_area;
        this.administration = administration;
        this.commission = commission;
        this.stratum = stratum;
        this.comments = comments;
        this.admon_comments = admon_comments;
        this.consultant = consultant;
        this.baths = baths;
        this.rooms = rooms;
        this.livings = livings;
        this.floors = floors;
        this.parkings = parkings;
        this.property_internal_details = property_internal_details;
        this.property_external_details = property_external_details;
        this.property_sector_details = property_sector_details;
        this.sharing = sharing;
        this.shared = shared;
        this.id_holder = id_holder;
        this.id_holder_property = id_holder_property;
        this.sector_name = sector_name;
        this.id_property_appropiate = id_property_appropiate;
    }

}
