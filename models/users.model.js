import  format  from 'pg-format';
import BaseModel from './base.model.js';

const TABLE = "users";

class UsersModel extends BaseModel {
    static async selectAll() {

        const sql = format(
            `SELECT * FROM ${TABLE};`
        );
        const result = await this.executeQuery(sql);
        return result;
    }

    static async selectById(id) {
        const sql = format(
            `SELECT * 
            FROM users 
            WHERE id = $1;`
        );
        const values = [id];

        const result = await this.executeQuery(sql, values);
        return result;
    }
    static async insert(userInfo) {
        const { name, nickname, age } = userInfo;

        const sql = format(
            `INSERT INTO ${TABLE} (name, nickname, age) 
            VALUES ($1, $2, $3) RETURNING id;`
        );
        const values = [
            name,
            nickname,
            age
        ]
        const result = await this.executeQuery(sql, values);
        return result;
    }

    static async delete(id) {

        const sql = format(
            `DELETE FROM ${TABLE} 
            WHERE id = $1;`
        );
        const values = [
            id
        ]
        const result = await this.executeQuery(sql, values);
        return result;
    }
}
export default UsersModel;