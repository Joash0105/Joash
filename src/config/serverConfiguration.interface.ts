import { Server } from 'http';
import { Express } from 'express';

/**
 * The configuration of the server
 */
export interface ServerConfigurationInterface {
  /**
   * The HTTP server
   * @type {Server}
   */
  server: Server;
  /**
   * The port from where the server is running
   * @type {number}
   */
  port: number;
  /**
   * The Express application
   * @type {Express}
   */
  app: Express;
  /**
   * The API endpoint of the server
   * @type {string}
   */
  url: string;
}