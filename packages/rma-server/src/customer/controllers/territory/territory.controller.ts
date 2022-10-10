import {
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Body,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { UpdateTerritoryDto } from '../../entity/territory/update-territory-dto';
import { TerritoryAggregateService } from '../../aggregates/territory-aggregate/territory-aggregate.service';
import { TerritoryDto } from '../../entity/territory/territory-dto';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { SYSTEM_MANAGER } from '../../../constants/app-strings';

@Controller('territory')
export class TerritoryController {
  constructor(private readonly territory: TerritoryAggregateService) {}

  @Post('v1/create')
  @Roles(SYSTEM_MANAGER)
  @UseGuards(TokenGuard, RoleGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() payload: TerritoryDto) {
    return this.territory.addTerritory(payload);
  }

  @Post('v1/remove/:uuid')
  @Roles(SYSTEM_MANAGER)
  @UseGuards(TokenGuard, RoleGuard)
  async remove(@Param('uuid') uuid) {
    return await this.territory.removeTerritory(uuid);
  }

  @Get('v1/get/:uuid')
  @UseGuards(TokenGuard)
  async getTerritory(@Param('uuid') uuid) {
    return await this.territory.retrieveTerritory(uuid);
  }

  @Get('v1/list')
  @UseGuards(TokenGuard)
  async getTerritoryList(
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
    @Query('search') search = '',
    @Query('sort') sort,
    @Query('group') group,
  ) {
    if (sort !== 'ASC') {
      sort = 'DESC';
    }
    try {
      group = JSON.parse(group);
    } catch {
      group = false;
    }
    return await this.territory.getTerritoryList(
      offset,
      limit,
      search,
      sort,
      group,
    );
  }

  @Post('v1/update')
  @Roles(SYSTEM_MANAGER)
  @UseGuards(TokenGuard, RoleGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateTerritory(@Body() updatePayload: UpdateTerritoryDto) {
    return this.territory.updateTerritory(updatePayload);
  }

  @Get('v1/get_warehouses_for_territories')
  @UseGuards(TokenGuard)
  getWarehousesForTerritories(@Query('territories') territories: string[]) {
    return this.territory.getWarehousesForTerritories(territories);
  }

  @Get('v1/get_territory_by_warehouse/:warehouse')
  @UseGuards(TokenGuard)
  getTerritoriesByWarehouse(@Param('warehouse') warehouse: string) {
    return this.territory.findTerritoryByWarehouse(warehouse);
  }
}
