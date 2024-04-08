const { Pool } = require('pg');

class PrivateDatabaseSingleton {
    constructor() {
        this.pool = new Pool({
            host: 'db',
            port : 5432,
            user: 'user',
            password: 'password',
            database: 'postgres',
            max: 50,
            idleTimeoutMillis: 10000,
            connectionTimeoutMillis: 10000
        });

        this.pool.on("error", (err, client) => {
            console.error(`database pool error on db: ${client.database}`, err);
        });

        this.pool.on("connect", (client) => {
            client.on("error", (err) => {
                console.info("caught connection error", err);
            });
        });
    }

    async query(sql, values = null) {
        let client;
        try {
            client = await this.getConnection();
            console.log("sql:",sql);
            console.log("values:",values);

            return values == null ? await client.query(sql) : await client.query(sql, values);
        } catch (err) {
            console.error("query error:", err);
            if (err.message.includes("connection timeout")) {
                throw new ConnectionTimeoutError(err.message);
            }
            throw err;

        } finally {
            client?.release();
        }
    }

    async getConnection() {
        let client;
        try {
            client = await this.pool.connect();
            const result = await client.query("SELECT 1");
            if (!result || result.rows.length === 0) throw new Error("unavailable connection");
        } catch (e) {
            // take another connection after 1 second
            console.info("wait for 1 second to get another connection", e);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            client = await this.pool.connect();
        }
        return client;
    }

    async getDbClient() {
        return this.pool.connect();
    }
    async end() {
        await this.pool.end();
    }
}
class DatabaseSingleton {
    constructor() {
        throw new Error("Use Singleton.getInstance()");
    }

    static getInstance() {
        if (!DatabaseSingleton.instance) {
            DatabaseSingleton.instance = new PrivateDatabaseSingleton();
            console.info("Database connect");
        }
        return DatabaseSingleton.instance;
    }
}
module.exports = DatabaseSingleton
