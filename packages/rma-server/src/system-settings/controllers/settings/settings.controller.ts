import {
  Controller,
  Get,
  UsePipes,
  ValidationPipe,
  Body,
  Post,
  UseGuards,
  Req,
  Param,
  Query,
} from '@nestjs/common';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ServerSettingsDto } from '../../../system-settings/entities/server-settings/server-setting.dto';
import { SYSTEM_MANAGER } from '../../../constants/app-strings';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { SettingsService } from '../../aggregates/settings/settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('v1/get')
  @Roles(SYSTEM_MANAGER)
  @UseGuards(TokenGuard, RoleGuard)
  async getSettings() {
    return await this.settingsService.find();
  }

  @Post('v1/update')
  @Roles(SYSTEM_MANAGER)
  @UseGuards(TokenGuard, RoleGuard)
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  updateSettings(@Body() payload: ServerSettingsDto) {
    return from(this.settingsService.find()).pipe(
      switchMap(settings => {
        return from(
          this.settingsService.updateMany(
            { uuid: settings.uuid },
            { $set: payload },
          ),
        );
      }),
    );
  }

  @Post('v1/update_webhook_key')
  @Roles(SYSTEM_MANAGER)
  @UseGuards(TokenGuard, RoleGuard)
  updateFrappeServerApi() {
    return this.settingsService.updateFrappeWebhookKey();
  }

  @Post('v1/setup_webhooks')
  @Roles(SYSTEM_MANAGER)
  @UseGuards(TokenGuard, RoleGuard)
  setupWebhooks() {
    return this.settingsService.setupWebhooks();
  }

  @Post('v1/setup_company/:company_name')
  @UseGuards(TokenGuard)
  setupDefaultCompany(@Param('company_name') companyName, @Req() req) {
    return this.settingsService.setDefaultCompany(companyName, req);
  }

  @Post('v1/update_company/:company_name')
  @Roles(SYSTEM_MANAGER)
  @UseGuards(TokenGuard, RoleGuard)
  updateDefaultCompany(@Param('company_name') companyName, @Req() req) {
    return this.settingsService.updateDefaultCompany(companyName, req);
  }

  @Get('v1/profile')
  @UseGuards(TokenGuard)
  async getUserProfile(@Req() req) {
    return await this.settingsService.getUserProfile(req);
  }

  @Get('v1/relay_list_companies')
  @Roles(SYSTEM_MANAGER)
  @UseGuards(TokenGuard, RoleGuard)
  relayListCompanies(@Query() query) {
    return this.settingsService.relayListCompanies(query);
  }

  @Get('v1/relay_get_defaults')
  relayGetDefaults() {
    return this.settingsService.relayListDefaults();
  }
}
