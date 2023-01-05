import { DatabaseDaoInterface } from "./databaseDao.interface.js";
import { inject, injectable } from 'tsyringe';
import mysql from 'mysql2/promise';
import 'dotenv/config';
import { DatabaseConfigInterface } from "../config/databaseConfig.interface.js";
import { DatabaseConfigFactoryInterface } from "../config/databaseConfigFactory.interface.js";

@injectable()
export class DatabaseDao implements DatabaseDaoInterface {

    db_access: DatabaseConfigInterface;

    constructor(@inject('DatabaseConfigFactoryInterface') $configFactory: DatabaseConfigFactoryInterface) {
        this.db_access = $configFactory.getDatabaseConfig();
    }

    async executeQuery(queryString: string, filter?: any[] | undefined) {
        const db = await mysql.createConnection({
            host: this.db_access.host,
            user: this.db_access.dbuser,
            password: this.db_access.dbpwd,
            database: this.db_access.dbname,
            multipleStatements: true,
        });

        const [rows] = await db.execute(queryString, filter);
        const result = rows;

        db.end();

        return result;
    }

}