import { pool } from './DB/DB.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
/**
 * @param {*} pass
 * @returns
 */

const SALT_SIZE = parseInt(process.env.SALT_SIZE || '16');

export const getSalt = () => {
    return crypto.randomBytes(Math.ceil(SALT_SIZE * 3 / 4)).toString('base64url').substring(0, process.env.SALT_SIZE);
}

export async function encryptPassword(text, salt){
    const hashing = crypto.createHash('sha512');
    const hash = hashing.update(salt + text).digest('base64url');
    return hash;
}

/**
 * @param {*} username
 * @param {*} password
 */

export async function isValidUser(username, password){
    let query = 'SELECT id, name, username, password FROM users WHERE username = ?';
    let params = [username];
    const [rows] = await pool.promise().query(query, params);
    let user = rows[0];
    if(user){
        const salt = user.password.substring(0, SALT_SIZE);
        const hash = await encryptPassword(password, salt);
        const expectedPassword = salt + hash;

        if(user.password === expectedPassword){
            return user;
        }
    }
    return null;
}