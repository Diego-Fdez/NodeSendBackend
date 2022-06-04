import {validationResult} from "express-validator";
import shortid from "shortid";
import Enlace from "../models/Enlace.js";
import bcrypt from "bcrypt";

const nuevoEnlace = async (req, res, next) => {
  //mostrar mensajes de error de express validator
  const errores = validationResult(req);
  if(!errores.isEmpty()) {
    return res.status(400).json({errores: errores.array()});
  };
  //crear un objeto de Enlace
  const {nombre_original, nombre} = req.body;
  const enlace = new Enlace(req.body);
  //genera el url del enlace
  enlace.url = shortid.generate();
  //genera el nombre del archivo
  enlace.nombre = nombre;
  enlace.nombre_original = nombre_original;

  //si el usuario esta logeado
  if(req.usuario) {
    const {password, descargas} = req.body;
    //asignar a enlace número de descargas
    if(descargas) {
      enlace.descargas = descargas;
    }
    //asignar un password
    if(password) {
      enlace.password = password;
    }

    //asignar el autor
    enlace.autor = req.usuario.id;
  }
  //almacenar en la BD
  try {
    await enlace.save();
    res.json({msg: `${enlace.url}`});
  } catch (error) {
    res.status(401).json({msg: 'No se pudo generar el enlace', error});
    return next();
  }
};

//verifica si el password es correcto
const verificarPassword = async (req, res, next) => {
  const {url} = req.params;
  const {password} = req.body;

  //consultar por el enlace
  const enlace = await Enlace.findOne({url});
  //verifica el password
  if(bcrypt.compareSync(password, enlace.password)) {
    //permitir descargar el archivo
    next();
  } else {
    res.status(401).json({msg: 'Contraseña incorrecta'})
  }
  
};

//obtener el enlace
const obtenerEnlace = async (req, res, next) => {
  const {url} = req.params;
  //verificar si existe el usuario
  const enlace = await Enlace.findOne({url});
  if(!enlace) {
    res.status(404).json({msg: 'Ese enlace no existe'});
    return next();
  }
  //si el enlace existe
  res.json({archivo: enlace.nombre, password: false});
  next();
}

const todosEnlaces = async (req, res, next) => {
  try {
    const enlaces = await Enlace.find({}).select('url -_id');
    res.json({enlaces});
  } catch (error) {
    res.status(404).json({msg: 'No hay enlaces para mostrar'});
    return next();
  }
};

//consulta si tiene password
const tienePassword = async (req, res, next) => {
  const {url} = req.params;
  //verificar si existe el enlace
  const enlace = await Enlace.findOne({url})
  if(!enlace) {
    res.status(404).json({msg: 'El enlace no existe'});
    return next();
  }

  if(enlace.password) {
    return res.json({password: true, enlace: enlace.url});
  }
  next();
};

export {
  nuevoEnlace,
  obtenerEnlace,
  tienePassword,
  todosEnlaces,
  verificarPassword
}