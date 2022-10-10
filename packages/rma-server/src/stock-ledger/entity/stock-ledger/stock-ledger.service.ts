import { InjectRepository } from '@nestjs/typeorm';
import { StockLedger } from './stock-ledger.entity';
import { Injectable } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class StockLedgerService {
  constructor(
    @InjectRepository(StockLedger)
    private readonly stockLedgerRepository: MongoRepository<StockLedger>,
  ) {}

  async find(query?) {
    return await this.stockLedgerRepository.find(query);
  }

  async create(stockLedger: StockLedger) {
    return await this.stockLedgerRepository.insertOne(stockLedger);
  }

  async findOne(param, options?) {
    return await this.stockLedgerRepository.findOne(param, options);
  }

  async deleteOne(query, options?) {
    return await this.stockLedgerRepository.deleteOne(query, options);
  }

  asyncAggregate(query) {
    return of(this.stockLedgerRepository.aggregate(query)).pipe(
      switchMap((aggregateData: any) => {
        return aggregateData.toArray();
      }),
    );
  }

  async updateOne(query, options?) {
    return await this.stockLedgerRepository.updateOne(query, options);
  }

  async insertMany(query, options?) {
    return await this.stockLedgerRepository.insertMany(query, options);
  }
}
