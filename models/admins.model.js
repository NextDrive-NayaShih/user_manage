import  format  from 'pg-format';
import BaseModel from './base.model.js';

const TABLE = "admins";

class AdminsModel extends BaseModel{
    static async insert(adminInfo) {
        const { username, password } = adminInfo;
    
        const sql = format(
            `INSERT INTO ${TABLE} (username, password) 
             VALUES ($1, $2) RETURNING id;`
        );
        const values = [
            username,
            password
        ]
        const result = await this.executeQuery(sql, values);
        return result.rows[0].id;
    }

    static async login(adminInfo) {
        const { username, password } = adminInfo;

        const sql = format(
            `SELECT * FROM ${TABLE} 
            WHERE username = $1 
            AND password = $2;`
        );
        const values = [username, password];

        const result = await this.executeQuery(sql, values);
        return result;
    }

}

export default AdminsModel;