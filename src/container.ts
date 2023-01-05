import { container } from 'tsyringe';
import ConfigFactory from './config/factory.js';

export const bootstrapContainer = () => {
    container.register('ApplicationConfigFactoryInterface', {
        useClass: ConfigFactory,
    });

    container.register('DatabaseConfigFactoryInterface', {
        useClass: ConfigFactory,
    });
};