import { pool } from '../DB/db.js';

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

export const postUser = (req, res) => {
    const{username, password} = req.body;
    pool.execute(
        "INSERT INTO users (name, username, password, age, email) VALUES (?,?,?,?,?)",
        [name, username, password, age],
        (error, results) => {
            if (error) {
                res.status(500).json({msg: error, users: []});
                return;
            }
            res.status(200).json({msg: "Ok", users: results});
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
export const login = (req, res) => {
    const {username, password} = req.body;
    pool.execute(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password],
        (error, results) => {
            if (error) {
                res.status(500).json({msg: error, users: []});
                return;
            }
            res.status(200).json({msg: "Ok", users: results});
        }
    );
};