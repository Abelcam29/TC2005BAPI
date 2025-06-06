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

//modificar funcion 
    export const getUser = (req, res) => {
        const id = req.query.id;
        pool.execute("Select * from users where id = ?", [id], (error, results) => {
            if (error) {
                res.status(500).json({msg: error, users: []});
                return;
            }
            res.status(200).json({msg: "Ok", users: results});
        });
    };


export async function postUser(req, res){
    const {name, username, password, age} = req.body;
    const salt = HashService.getSalt();
    const hash = await HashService.encryptPassword(password, salt);
    const hash_password = salt + hash;
    
    // Primero INSERT, luego SELECT
    pool.execute(
        "INSERT INTO users (name, username, password, age) VALUES (?,?,?,?)",
        [name, username, hash_password, age],
        (error, results) => {
            if (error) {
                res.status(500).json({msg: error, users: []});
                return;
            }
            
            // Solo si INSERT fue exitoso, hacer SELECT
            pool.execute(
                "SELECT * FROM users WHERE username = ?",
                [username],
                (error, results) => {
                    if (error) {
                        res.status(500).json({msg: error, users: []});
                        return;
                    }
                    res.status(200).json({msg: "Ok", users: results});
                }
            );
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

export const guardarPuntuacion = (req, res) => {
    const id = req.query.id;
    const puntuacion = req.body.puntuacion;
    
    // Validar que el id y puntuacion existen
    if (!id) {
        return res.status(400).json({ message: "ID de usuario requerido en query params" });
    }
    
    if (puntuacion === undefined || puntuacion === null) {
        return res.status(400).json({ message: "Puntuacion is required" });
    }
    
    pool.execute(
        "UPDATE users SET puntuación = ? WHERE id = ?",
        [puntuacion, id],
        (error, results) => {
            if (error) {
                console.error("Error al guardar puntuación:", error);
                res.status(500).json({ message: "Error interno del servidor", error: error });
                return;
            }
            
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            
            res.status(200).json({ 
                message: "Puntuación guardada correctamente", 
                userId: id,
                puntuacion: puntuacion
            });
        }
    );
};