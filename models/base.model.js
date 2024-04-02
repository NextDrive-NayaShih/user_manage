const dbConn = require('../DatabaseSingleton')
class BaseModel {
    static async executeQuery(sql, values = null, dbClient = null) {
        const dbInstance = dbClient || dbConn.getInstance();
        const result = await dbInstance.query(sql, values);
        return result;
    }

    static async executeTransaction(transactionCb) {
        const dbClient = await dbConn.getInstance().getDbClient();
        try {
            await dbClient.query("BEGIN");
            const result = await transactionCb(dbClient);
            await dbClient.query("COMMIT");
            return result;
        } catch (error) {
            await dbClient.query("ROLLBACK");
            throw error;
        } finally {
            console.info("execute DB transaction complete");
            dbClient.release();
        }
    }

    static async returnFirst(sql, values = null, dbClient = null) {
        const dbInstance = dbClient || dbConn.getInstance();
        const result = await dbInstance.query(sql, values);
        if (result.rowCount === 0) {
            return {};
        }
        return result.rows[0];
    }

    static async checkHealth() {
        const dbInstance = dbConn.getInstance();
        const result = await dbInstance.query("SELECT 1");
        return result.rows.length > 0;
    }
}

// export const returnFirstOne = async (sql, values, dbClient) => {
//     const result = await BaseModel.executeQuery(sql, values, dbClient);
//     return result.rows?.[0] || {};
// };

// export const returnArray = async (sql, values, dbClient) => {
//     const result = await BaseModel.executeQuery(sql, values, dbClient);
//     return result.rows || [];
// };

module.exports = BaseModel;