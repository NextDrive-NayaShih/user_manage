const dbConn = require('../DatabaseSingleton')
class BaseModel {
    static async executeQuery(sql, values = null, dbClient = null) {
        const dbInstance = dbClient || dbConn.getInstance();
        console.info("dbInstance:",dbInstance);
        const result = await dbInstance.query(sql, values);
        return result;
    }
}

module.exports = BaseModel;