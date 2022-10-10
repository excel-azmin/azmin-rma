import { HttpException, HttpStatus } from '@nestjs/common';
import { SETUP_ALREADY_COMPLETE } from '../constants/messages';

export const settingsAlreadyExists = new HttpException(
  SETUP_ALREADY_COMPLETE,
  HttpStatus.BAD_REQUEST,
);

export class SyncAlreadyInProgressException extends Error {}
