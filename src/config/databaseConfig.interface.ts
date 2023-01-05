/**
 * The configuration for a database connection
 */
 export interface DatabaseConfigInterface {
    /**
     * Hostname
     */
    host: string;
    /**
     * Database name
     */
    dbname: string;
    /**
     * Username
     */
    dbuser: string;
    /**
     * Password for username
     */
    dbpwd: string;
  }