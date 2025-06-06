import {Router} from 'express';
import { getUsers ,getUser, putUser, deleteUser, postUser, login, guardarPuntuacion} from "../controllers/users.controllers.js";

const router = Router();

router.get('/users', getUsers);
router.get('/user/', getUser);
router.post('/insertUser', postUser);
router.put('/users/:id', putUser);
router.delete('/users/:id', deleteUser);
router.post("/login", login);
router.post('/guardarpuntaje', guardarPuntuacion); 

export default router;