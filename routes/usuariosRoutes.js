import express from "express";
import {body} from "express-validator";
import checkAuth from "../middleware/checkAuth.js";
const router = express.Router();
import Auth from "../config/auth.js";

import {
  registrar,
  login,
  perfil
} from "../controllers/usuariosController.js";

//registro y confirmación de usuarios
router.post("/",
//validaciones de express validator
body('nombre', 'El nombre es requerido').not().isEmpty(),
body('email', 'No es un correo válido').isEmail(),
body('password', 'La contraseña debe tener al menos 6 caracteres').isLength({min: 6}),
 registrar); //registrar usuario

//login de usuarios
router.post("/login",
//validaciones de express validator
body('email', 'El correo es requerido').isEmail(),
body('password', 'La contraseña es requerida').not().isEmpty(),
 login); //registrar usuario

//obtiene el usuario logeado
router.get("/perfil", Auth, perfil); //verifica si el usuario esta registrado


export default router;