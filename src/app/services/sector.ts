export class Sector {
  id:number;
  id_location: number;
  id_sector: number;
  sector: string;

  constructor(id:number, id_location: number, id_sector: number, sector: string) {
    this.id = id;
    this.id_location = id_location;
    this.id_sector = id_sector;
    this.sector = sector;
  }

}
