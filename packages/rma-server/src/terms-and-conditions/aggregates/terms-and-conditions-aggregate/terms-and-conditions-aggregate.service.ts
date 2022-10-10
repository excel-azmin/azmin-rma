import { Injectable } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import {
  CreateTermsAndConditionsDto,
  UpdateTermsAndConditionsDto,
} from '../../entity/terms-and-conditions/terms-and-conditions.dto';
import { TermsAndConditions } from '../../entity/terms-and-conditions/terms-and-conditions.entity';
import { TermsAndConditionsService } from '../../entity/terms-and-conditions/terms-and-conditions.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TermsAndConditionsAggregateService extends AggregateRoot {
  constructor(
    private readonly termsAndConditionsService: TermsAndConditionsService,
  ) {
    super();
  }

  async createTermsAndConditions(
    termsAndConditionsPayload: CreateTermsAndConditionsDto,
  ) {
    const termsAndConditions = new TermsAndConditions();
    Object.assign(termsAndConditions, termsAndConditionsPayload);
    termsAndConditions.uuid = uuidv4();
    return await this.termsAndConditionsService.create(termsAndConditions);
  }

  async updateTermsAndConditions(
    termsAndConditionsPayload: UpdateTermsAndConditionsDto,
  ) {
    const termsAndConditions = await this.termsAndConditionsService.findOne({
      uuid: termsAndConditionsPayload.uuid,
    });
    Object.assign(termsAndConditions, termsAndConditionsPayload);
    return await this.termsAndConditionsService.updateOne(
      { uuid: termsAndConditionsPayload.uuid },
      { $set: termsAndConditionsPayload },
    );
  }

  async list(offset, limit, search, sort) {
    if (!sort || sort === '') {
      sort = 'ASC';
    }

    if (sort !== 'ASC') {
      sort = 'DESC';
    }

    return await this.termsAndConditionsService.list(
      offset,
      limit,
      search,
      sort,
    );
  }

  async getTermsAndConditions(uuid: string) {
    return await this.termsAndConditionsService.findOne({ uuid });
  }

  async deleteTermsAndConditions(uuid: string) {
    return await this.termsAndConditionsService.deleteOne({ uuid });
  }
}
