import { pool } from './DB/DB.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
/**
 * @param {*} pass
 * @returns
 */

const SALT_SIZE = 16; // Fijo a 16

export const getSalt = () => {
    return crypto.randomBytes(8).toString('hex'); // 8 bytes = 16 caracteres hex
}

export async function encryptPassword(text, salt){
    const hashing = crypto.createHash('sha256');
    const hash = hashing.update(salt + text).digest('hex');
    return hash;
}

export async function isValidUser(username, password){
    let query = 'SELECT id, name, username, password FROM users WHERE username = ?';
    let params = [username];
    const [rows] = await pool.promise().query(query, params);
    let user = rows[0];
    if(user){
        const salt = user.password.substring(0, SALT_SIZE);
        const hash = await encryptPassword(password, salt);
        const expectedPassword = salt + hash;

        // TEMPORAL - para ver qué está pasando
        console.log("Password en BD:", user.password);
        console.log("Salt extraído:", salt);
        console.log("Hash calculado:", expectedPassword);
        console.log("¿Son iguales?", user.password === expectedPassword);

        if(user.password === expectedPassword){
            return user;
        }
    }
    return null;
}