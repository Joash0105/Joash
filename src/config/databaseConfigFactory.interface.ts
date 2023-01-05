import { DatabaseConfigInterface } from './databaseConfig.interface.js';

/**
 * The database configuration generator
 */
export interface DatabaseConfigFactoryInterface {
  /**
   * Generates database configuration
   *
   * @returns DatabaseConfigInterface
   */
  getDatabaseConfig(): DatabaseConfigInterface;
}