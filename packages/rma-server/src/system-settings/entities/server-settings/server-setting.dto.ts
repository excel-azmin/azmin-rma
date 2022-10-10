import { IsUrl, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BrandSettingsDTO {
  @IsOptional()
  @ApiProperty({
    description: 'Favicon URL',
    type: 'string',
  })
  faviconURL: string;
}
export class ServerSettingsDto {
  uuid?: string;

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    description: 'The URL of the server.',
    type: 'string',
    required: true,
  })
  appURL: string;

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    description: 'The URL of the warranty-server.',
    type: 'string',
    required: true,
  })
  warrantyAppURL: string;

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    description: 'The URL of the pos-server.',
    type: 'string',
    required: true,
  })
  posAppURL: string;

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    description: 'The URL of the frappe-server.',
    type: 'string',
    required: true,
  })
  authServerURL: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The clientId of the front-end client on frappe.',
    type: 'string',
    required: true,
  })
  frontendClientId: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The clientId of the back-end client on frappe..',
    type: 'string',
    required: true,
  })
  backendClientId: string;

  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({
    description: 'Scopes on OAuth2 client',
    type: 'string',
    required: true,
  })
  scope: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The callback protocol for mobile app.',
    type: 'string',
    required: true,
  })
  callbackProtocol: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Service account',
    type: 'string',
    required: true,
  })
  serviceAccountUser: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Service account secret',
    type: 'string',
    required: true,
  })
  serviceAccountSecret: string;

  @IsOptional()
  @ApiProperty({
    description: 'API Key to be used from frappe webhook',
    type: 'string',
    required: true,
  })
  webhookApiKey: string;

  @IsOptional()
  @ApiProperty({
    description: 'Default Company for app from ERPNext',
    type: 'string',
    required: true,
  })
  defaultCompany: string;

  @IsOptional()
  @ApiProperty({
    description: 'Selling Price List from ERPNext',
    type: 'string',
    required: true,
  })
  sellingPriceList: string;

  @IsOptional()
  @ApiProperty({
    description: 'ERPNext Server timezone',
    type: 'string',
    required: true,
  })
  timeZone: string;

  @IsOptional()
  @ApiProperty({
    description: 'ERPNext transfer warehouse',
    type: 'string',
  })
  transferWarehouse: string;

  @IsOptional()
  @ApiProperty({
    description: 'ERPNext debtor account',
    type: 'string',
  })
  debtorAccount: string;

  @IsOptional()
  @ApiProperty({
    description: 'ERPNext service account key',
    type: 'string',
  })
  serviceAccountApiKey: string;

  @IsOptional()
  @ApiProperty({
    description: 'ERPNext service account secret',
    type: 'string',
  })
  serviceAccountApiSecret: string;

  @IsOptional()
  @ApiProperty({
    description: 'ERPNext POS Profiles',
    type: 'string',
  })
  posProfile: string;

  @IsOptional()
  @ApiProperty({
    description: 'Print Header Image',
    type: 'string',
  })
  headerImageURL: string;

  @IsOptional()
  @ApiProperty({
    description: 'Print Header width',
    type: 'number',
  })
  headerWidth: number;

  @IsOptional()
  @ApiProperty({
    description: 'Print Footer Image',
    type: 'string',
  })
  footerImageURL: string;

  @IsOptional()
  @ApiProperty({
    description: 'Print Header width',
    type: 'number',
  })
  footerWidth: number;

  @IsOptional()
  @ApiProperty({
    description: 'Brand Settings',
    type: 'object',
  })
  brand: BrandSettingsDTO;
  backdatedInvoices: boolean;
  backdatedInvoicesForDays: number;
}
