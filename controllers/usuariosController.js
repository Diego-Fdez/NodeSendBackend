import Usuario from "../models/Usuario.js";
import {validationResult} from "express-validator";
import jwt from "jsonwebtoken";

//Registra un usuario
const registrar = async (req, res) => {
  //mostrar mensajes de error de express validator
  const errores = validationResult(req);
  if(!errores.isEmpty()) {
    return res.status(400).json({errores: errores.array()});
  };

  //Evitar registros duplicados
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({email});
  if(existeUsuario) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message});
  }
  //si pasa las validaciones, registramos al usuario
  try {
    const usuario = new Usuario(req.body);
    await usuario.save();
    
    res.json({msg: 'Usuario Creado Correctamente'});
  } catch (error) {
    return res.status(404).json({msg: "Hubo un error, intenta de nuevo", error});
  }
};

//función que logea a un usuario
const login = async (req, res, next) => {
//mostrar mensajes de error de express validator
  const errores = validationResult(req);
  if(!errores.isEmpty()) {
    return res.status(400).json({errores: errores.array()});
  };
  //buscar si el usuario existe
  const { email, password } = req.body;
  const existeUsuario = await Usuario.findOne({email});
  if(!existeUsuario) {
    const error = new Error("El usuario no existe");
    return res.status(401).json({ msg: error.message});
  }
  //verificar el password
  if(await existeUsuario.comprobarPassword(password)) {
    //crear JWT
    const token = jwt.sign({
      id: existeUsuario._id,
      nombre: existeUsuario.nombre,
      email: existeUsuario.email
    },process.env.JWT_SECRET, {
      expiresIn: '8h'
    });
    res.json({
      token
    });
  } else {
    const error = new Error("El Password es incorrecto");
    res.status(401).json({msg: error.message});
    return next();
  }

};

//usuario autenticado
const perfil = (req, res, next) => {
  res.json({usuario: req.usuario } );
};

export {
  registrar,
  login,
  perfil
}