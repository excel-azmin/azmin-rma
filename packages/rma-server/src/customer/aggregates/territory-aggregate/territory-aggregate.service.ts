import {
  Injectable,
  NotFoundException,
  HttpService,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { switchMap, catchError, mergeMap, map, toArray } from 'rxjs/operators';
import { throwError, from, of, Observable, empty } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { TerritoryService } from '../../entity/territory/territory.service';
import { Territory } from '../../entity/territory/territory.entity';
import { TerritoryDto } from '../../entity/territory/territory-dto';
import { UpdateTerritoryDto } from '../../entity/territory/update-territory-dto';
import { SettingsService } from '../../../system-settings/aggregates/settings/settings.service';
import { ClientTokenManagerService } from '../../../auth/aggregates/client-token-manager/client-token-manager.service';
import {
  API_RESOURCE_TERRITORY,
  ERPNEXT_API_WAREHOUSE_ENDPOINT,
} from '../../../constants/routes';

@Injectable()
export class TerritoryAggregateService {
  constructor(
    private readonly territory: TerritoryService,
    private readonly http: HttpService,
    private readonly settings: SettingsService,
    private readonly clientToken: ClientTokenManagerService,
  ) {}

  addTerritory(territoryPayload: TerritoryDto) {
    const territory = new Territory();
    territory.uuid = uuidv4();
    Object.assign(territory, territoryPayload);
    return this.checkLocalTerritoryAndWarehouse(territory).pipe(
      switchMap(success => {
        return from(this.territory.create(territory));
      }),
    );
  }

  async retrieveTerritory(uuid: string) {
    const territory = await this.territory.findOne({ uuid });
    if (!territory) throw new NotFoundException();
    return territory;
  }

  async getTerritoryList(offset, limit, search, sort, group) {
    return await this.territory.list(
      Number(offset),
      Number(limit),
      search,
      sort,
      group,
    );
  }

  async removeTerritory(uuid: string) {
    const territoryFound = await this.territory.findOne({ uuid });
    if (!territoryFound) {
      throw new NotFoundException();
    }
    return await this.territory.deleteOne({ uuid: territoryFound.uuid });
  }

  updateTerritory(updatePayload: UpdateTerritoryDto) {
    return from(
      this.territory.findOne({
        uuid: updatePayload.uuid,
      }),
    ).pipe(
      switchMap(territory => {
        if (!territory) {
          return throwError(new NotFoundException());
        }
        const territoryPayload = Object.assign(territory, updatePayload);
        return this.checkLocalTerritoryAndWarehouse(territoryPayload).pipe(
          switchMap(success => {
            return from(
              this.territory.updateOne(
                { uuid: updatePayload.uuid },
                { $set: territoryPayload },
              ),
            );
          }),
        );
      }),
    );
  }

  checkLocalTerritoryAndWarehouse(territory: Territory): Observable<boolean> {
    return this.settings.find().pipe(
      switchMap(settings => {
        return this.clientToken.getServiceAccountApiHeaders().pipe(
          switchMap(headers => {
            return this.http
              .get(
                settings.authServerURL +
                  API_RESOURCE_TERRITORY +
                  '/' +
                  territory.name,
                { headers },
              )
              .pipe(
                switchMap(success => {
                  return this.http.get(
                    settings.authServerURL +
                      ERPNEXT_API_WAREHOUSE_ENDPOINT +
                      '/' +
                      territory.warehouse,
                    { headers },
                  );
                }),
              );
          }),
          catchError(error => {
            return throwError(new InternalServerErrorException(error));
          }),
          switchMap(response => {
            return this.findTerritoryByNameAndWarehouse(
              territory.name,
              territory.warehouse,
            );
          }),
          switchMap(localTerritory => {
            if (localTerritory) {
              return throwError(
                new BadRequestException(
                  'Provided warehouse already exists in territory',
                ),
              );
            }
            return of(true);
          }),
        );
      }),
    );
  }

  findTerritoryByNameAndWarehouse(name: string, warehouse: string) {
    return from(this.territory.findOne({ name, warehouse }));
  }

  getWarehousesForTerritories(territories: string[]) {
    if (!Array.isArray(territories)) {
      return throwError(new BadRequestException());
    }

    return from(territories).pipe(
      mergeMap(territory => {
        if (!territory) {
          return empty();
        }
        return from(this.territory.findOne({ name: territory }));
      }),
      map(territory => {
        return territory && territory.warehouse;
      }),
      toArray(),
      map(warehouses => ({
        warehouses: warehouses.filter((value, index, self) => {
          return self.indexOf(value) === index;
        }),
      })),
      map(filtered => ({
        warehouses: filtered.warehouses.map(warehouse => ({
          name: warehouse,
        })),
      })),
    );
  }

  findTerritoryByWarehouse(warehouse: string) {
    return from(this.territory.findOne({ warehouse })).pipe(
      switchMap(territory => {
        if (!territory) {
          return throwError(new NotFoundException('Territory not found'));
        }
        return of(territory);
      }),
    );
  }
}
