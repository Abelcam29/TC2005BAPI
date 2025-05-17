import {Router} from 'express';
import { getUsers ,getUser, putUser, deleteUser, postUser, login} from "../controllers/users.controllers.js";

const router = Router();

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.post('/insertUser', postUser);
router.put('/users/:id', putUser);
router.delete('/users/:id', deleteUser);
router.post("/login", login);

export default router;