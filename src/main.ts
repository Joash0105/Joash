/**
 * This is the main entry point.
 * This creates the API server as imported from server.js
 */
 import 'reflect-metadata';
 import { ApiServer } from './server.js';
 import { container } from 'tsyringe';
 import { bootstrapContainer } from './container.js';
 
 bootstrapContainer();
 const server = container.resolve(ApiServer);
 server.create();