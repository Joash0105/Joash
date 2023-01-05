import { ApplicationConfigInterface } from './appConfig.interface.js';

/**
 * This generates application configurations
 */
export interface ApplicationConfigFactoryInterface {
  /**
   * Generates application configuration
   * @returns ApplicationConfigInterface
   */
  getApplicationConfig(): ApplicationConfigInterface;
}