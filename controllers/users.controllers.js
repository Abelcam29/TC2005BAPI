import { pool } from '../DB/DB.js';
import * as HashService from '../hash.js';

export const getUsers = (req, res) => {
    pool.query('SELECT * FROM users', (error, results) =>{
        if (error) {
            res.status(500).json({msg: error, users: [] });
            return;
        }
        res.status(200).json({ msg: "Ok", users: results}); // results contains rows returned by server
    });
};
export const getUser = (req, res) => {
    const id = req.params.id;
    pool.execute("Select ¨* from users where id = ?", [id], (error, results) => {
        if (error) {
            res.status(500).json({msg: error, users: []});
            return;
        }
        res.status(200).json({msg: "Ok", users: results});
    });
};
export async function postUser(req, res){
    const{name, username, password, age} = req.body;
    const salt = HashService.getSalt();
    const hash = await HashService.encryptPassword(password, salt);
    const hash_password = salt + hash;
    pool.execute(
        "INSERT INTO users (name, username, password, age) VALUES (?,?,?,?)",
        [name, username, hash_password, age],
        (error, results) => {
            if (error) {
                res.status(500).json({msg: error, users: []});
                return;
            }
        }
    );
    pool.execute(
        "select * from users where Username = ?",
        [username],
        (error, results) => {
            if (error) {
                res.status(500).json({msg: error, users: []});
                return;
            }
            res.status(200).json({msg: "Ok", users: results});
        }
    );
};

export const putUser = (req, res) => {
    res.json({id: req.params.id});
    pool.execute(
        "UPDATE users SET name = ?, username = ?, password = ?, age = ? WHERE id = ?",
        [name, username, password, age, req.params.id],
        (error, results) => {
            if (error) {
                res.status(500).json({msg: error, users: []});
                return;
            }
            res.status(200).json({msg: "Ok", users: results});
        }
    );
};
export const deleteUser = (req, res) => {
    res.json({id: req.params.id});
    pool.execute(
        "DELETE FROM users WHERE id = ?",
        [req.params.id],
        (error, results) => {
            if (error) {
                res.status(500).json({msg: error, users: []});
                return;
            }
            res.status(200).json({msg: "Ok", users: results});
        }
    );
};
export async function login(req, res){
    try{
        const {username, password} = req.body;
        console.log(req.body);
        const user = await HashService.isValidUser(username, password);

        if(!user){
            return res.status(401).json({message: 'Invalid credentials'});
        }
        return res.status(200).json({message: 'Login successful', user});
    }catch (error){
        console.error(error);
        return res.status(500).json({message: 'Server error'});
    }
}