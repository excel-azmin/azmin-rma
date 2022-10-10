import { BadRequestException } from '@nestjs/common';
import { from, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export function lockDocumentTransaction(
  entityService: EntityService,
  query: { [key: string]: string },
) {
  // make sure to add findOneAndUpdate function in entity service in order for this to work,
  return of({}).pipe(
    switchMap(obj => {
      return from(
        entityService.findAndModify(
          {
            ...query,
            $or: [
              { transactionLock: { $exists: false } },
              { transactionLock: { $lt: new Date().getTime() } },
            ],
          },
          {
            $set: {
              transactionLock: new Date().getTime() + 30000,
            },
          },
        ),
      );
    }),
    switchMap(doc => {
      if (!doc?.value) {
        return throwError(
          new BadRequestException(
            'Invoice found to be in transaction at the moment please try again.',
          ),
        );
      }
      return of(true);
    }),
  );
}

export function unlockDocumentTransaction(
  entityService: EntityService,
  query: { [key: string]: string },
) {
  entityService
    .findAndModify(query, {
      $unset: {
        transactionLock: null,
      },
    })
    .then(success => {})
    .catch(err => {});
}

export interface EntityService {
  findAndModify: (param, query) => Promise<any>;
}
