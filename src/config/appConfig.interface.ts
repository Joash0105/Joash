/**
 * The application configuration options
 */
 export interface ApplicationConfigInterface {
    /**
     * The port the application is serving from
     */
    port: number;
    /**
     * Denotes whether the application is in maintenance mode. True, if in maintenance. Otherwise, false.
     */
    maintenance: boolean;
  }