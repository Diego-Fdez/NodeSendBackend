import express from "express";
import {body} from "express-validator";
import checkAuth from "../middleware/checkAuth.js";
const router = express.Router();

import {
nuevoEnlace,
obtenerEnlace,
tienePassword,
todosEnlaces,
verificarPassword
} from "../controllers/enlacesController.js";

//registro y confirmación de usuarios
router.post("/", checkAuth, 
  body('nombre', 'Sube un archivo').not().isEmpty(),
  body('nombre_original', 'Sube un archivo').not().isEmpty(),
 nuevoEnlace); //registrar un nuevo enlace

router.get('/', todosEnlaces);

router.get('/:url',
tienePassword,
obtenerEnlace
); //obtener el enlace

//verificar el password
router.post('/:url', 
verificarPassword, 
obtenerEnlace
)

export default router;