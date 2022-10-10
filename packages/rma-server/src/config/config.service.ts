import * as Joi from 'joi';
import * as dotenv from 'dotenv';
import { Injectable, Logger } from '@nestjs/common';

export interface EnvConfig {
  [prop: string]: string;
}

export const NODE_ENV = 'NODE_ENV';
export const DB_NAME = 'DB_NAME';
export const DB_HOST = 'DB_HOST';
export const DB_USER = 'DB_USER';
export const DB_PASSWORD = 'DB_PASSWORD';
export const MONGO_URI_PREFIX = 'MONGO_URI_PREFIX';
export const CACHE_DB_NAME = 'CACHE_DB_NAME';
export const CACHE_DB_USER = 'CACHE_DB_USER';
export const CACHE_DB_PASSWORD = 'CACHE_DB_PASSWORD';
export const AGENDA_JOBS_CONCURRENCY = 'AGENDA_JOBS_CONCURRENCY';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    const config = dotenv.config().parsed;
    this.envConfig = this.validateInput(config);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision', 'staging')
        .default('development'),
      DB_NAME: Joi.string().required(),
      DB_HOST: Joi.string().required(),
      DB_USER: Joi.string().required(),
      DB_PASSWORD: Joi.string().required(),
      CACHE_DB_NAME: Joi.string().required(),
      CACHE_DB_USER: Joi.string().required(),
      CACHE_DB_PASSWORD: Joi.string().required(),
      MONGO_URI_PREFIX: Joi.string().optional(),
      AGENDA_JOBS_CONCURRENCY: Joi.string().optional(),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );
    if (error) {
      Logger.error(error, error.stack, this.constructor.name);
      process.exit(1);
    }
    return validatedEnvConfig;
  }

  get(key: string): string {
    switch (key) {
      case DB_NAME || CACHE_DB_NAME:
        return process.env.NODE_ENV === 'test'
          ? `test_${this.envConfig[key]}`
          : this.envConfig[key];
      default:
        return this.envConfig[key];
    }
  }
}
