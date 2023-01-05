

export interface DatabaseDaoInterface {
    /**
     * Executes SQL query
     * @param query Query to execute.
     * @param filter Optional filter.
     * @returns SQL data in an array.
     */
    executeQuery(queryString: string, filter?: Array<any>): any;
}