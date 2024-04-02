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
            return values === null ? await client.query(sql) : await client.query(sql, values);
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
    // constructor({
    //     host,
    //     port,
    //     user,
    //     password,
    //     database
    // } = {}) {
    //     this.pool = new Pool({
    //         host: 'db',
    //         port: 5342,
    //         user:'user',
    //         password:'password',
    //         database:'postgres',
    //     });

    //     this.pool.on("error", function (error, _client) {
    //         console.error("database pool error");
    //         console.error(error);
    //     });

    //     this.pool.on("connect", (client) => {
    //         client.on("error", (err) => {
    //             console.info(`caught connection error: ${err}`)
    //         });
    //     });
    // }

    // // async query(sql, values = null) {
    // //     let client;
    // //     try {
    // //         client = await this.getConnection();
    // //         return isEmpty(values) ? await client.query(sql) : await client.query(sql, values);
    // //     } catch (err) {
    // //         console.error("query error:", err)
    // //         // logger.error("query error:", err);
    // //         throw err;
    // //     } finally {
    // //         client?.release();
    // //     }
    // // }

    // async getConnection() {
    //     let client;
    //     try {
    //         client = await this.pool.connect();
    //         console.info("client:",client)
    //         // const result = await client.query("SELECT 1");
    //         // if (!result || result.rows.length === 0) throw new Error("unavailable connection");
    //     } catch (e) {
    //         // take another connection after 1 second
    //         console.info("wait for 1 second to get another connection");
    //         await new Promise((resolve) => setTimeout(resolve, 1000));
    //         client = await this.pool.connect();
    //     }
    //     return client;
    // }

    // async getDbClient() {
    //     return this.pool.connect();
    // }

}

// class DatabaseSingleton {
//     constructor() {
//         throw new Error("Use Singleton.getInstance()");
//     }
//     static instances = {};

//     static getInstanceByConnName = (connName = 'naya', { host, port, user, password, name } = {}) => {
        
//         if (!DatabaseSingleton.instances?.[connName]) {
//             DatabaseSingleton.instances[connName] = new PrivateDatabaseSingleton({
//                 host,
//                 port,
//                 user,
//                 password,
//                 name
//             });
//             console.info(`DB[${connName}] instance is created`);
//         }
//         console.log("DB:",DatabaseSingleton.instances[connName])

//         return DatabaseSingleton.instances[connName];
//     };
//     // static instance;

//     // static getInstance() {
//     //     if (!DatabaseSingleton.instance) {
//     //         DatabaseSingleton.instance = new PrivateDatabaseSingleton();
//     //         console.log("Database connect");
//     //     }
//     //     return DatabaseSingleton.instance;
//     // }
// }

// const initializeDB = () => {
//     // Initial db connection
//     DatabaseSingleton.getInstanceByConnName('naya');
// };

// // const closeDB = () => {
// //     Object.keys(DB_CONFIG).map((key) => {
// //         console.info(`Release DB[${key}]`);
// //         return DatabaseSingleton.getInstanceByConnName(key).end();
// //     });
// // };
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
