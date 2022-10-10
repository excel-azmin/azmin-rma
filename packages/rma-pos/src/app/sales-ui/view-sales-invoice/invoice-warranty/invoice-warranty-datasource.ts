import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, of } from 'rxjs';

export interface Warranty {
  claimNo: string;
  claimedItem: string;
  serial: string;
  claimsReceivedDate: string;
  status: string;
  deliveryDate: string;
  createdBy: string;
}

export class InvoiceWarrantyDataSource extends DataSource<Warranty> {
  itemSubject = new BehaviorSubject<Warranty[]>([]);

  constructor() {
    super();
  }

  connect() {
    return this.itemSubject.asObservable();
  }
  disconnect() {
    this.itemSubject.complete();
  }

  loadItems() {
    this.getWarrantyList().subscribe(warranty =>
      this.itemSubject.next(warranty),
    );
  }

  data() {
    return this.itemSubject.value;
  }

  update(data) {
    this.itemSubject.next(data);
  }

  getWarrantyList() {
    const warrantyList: Array<Warranty> = [
      {
        claimNo: 'Claim-0001',
        claimedItem: 'HIKVISION-963aw',
        serial: 'hik789',
        claimsReceivedDate: '02.01.2020',
        status: 'Delivered',
        deliveryDate: '03.01.2020',
        createdBy: 'Prafful',
      },
      {
        claimNo: 'Claim-0002',
        claimedItem: 'TL-WR840N',
        serial: 'TLWR840n2344513',
        claimsReceivedDate: '04.01.2020',
        status: 'In progress',
        deliveryDate: '',
        createdBy: 'Revant',
      },
    ];

    return of(warrantyList);
  }
}
