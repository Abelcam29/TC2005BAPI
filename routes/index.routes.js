import { Router } from "express";
import { abc, marco, ping, saludo } from "../controllers/index.controllers.js";

const router = Router();

router.get("/", saludo); // Nueva ruta raíz
router.get("/ping", ping);
router.get("/marco", marco);
router.get("/a/b/c", abc);

export default router;