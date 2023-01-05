
import 'dotenv/config';
import { checkEnvVars } from '../helpers/configChecker.js';
import { ApplicationConfigInterface } from './appConfig.interface.js';
import { DatabaseConfigInterface } from './databaseConfig.interface.js';
import { DatabaseConfigFactoryInterface } from './databaseConfigFactory.interface.js';


export class ConfigFactory implements DatabaseConfigFactoryInterface {
  constructor() {
    // do nothing.
  }

  /**
   * Get application config from .env
   * @returns application config
   */
  getApplicationConfig(): ApplicationConfigInterface {
    checkEnvVars(['PORT']);
    const port = process.env.PORT!;
    return {
      port: parseInt(port.trim()),
      maintenance: process.env.MAINTENANCE == 'true',
    };
  }

  /**
   * Get database config from .env
   * @returns database config
   */
  getDatabaseConfig(): DatabaseConfigInterface {
    checkEnvVars(['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS']);
    const host = process.env.DB_HOST!;
    const dbname = process.env.DB_NAME!;
    const dbuser = process.env.DB_USER!;
    const dbpwd = process.env.DB_PASS!;
    return {
      host,
      dbname,
      dbuser,
      dbpwd,
    };
  }
}

export default ConfigFactory;