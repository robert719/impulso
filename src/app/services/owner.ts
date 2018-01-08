export class Owner {
  id:number;
  name: string;
  email: string;
  document: number;
  phone1: number;
  phone2: number;
  date: any;

  constructor(id:number, name: string, email?: string, document?: number, phone1?: number, phone2?: number, date?: any) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.document = document;
    this.phone1 = phone1;
    this.phone2 = phone2;
    this.date = date;
  }

}
