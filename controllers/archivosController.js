import multer from "multer";
import shortid from "shortid";
import fs from "fs";
import Enlace from "../models/Enlace.js";

//función que sube el archivo
const subirArchivo = async (req, res, next) => {
  //configuración de multer
const configurarMulter = {
  limits: { fileSize: (req.usuario ? (1024 * 1024 * 10) : (1024 * 1024))},
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
      const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
      cb(null, `${shortid.generate()}${extension}`);
    }
  })
};
const upload = multer(configurarMulter).single('archivo');
//subida del archivo
  upload(req, res, async(error) => {
    if(!error) {
      res.json({archivo: req.file.filename});
    } else {
      res.status(400).json({ msg: 'Error al subir el archivo:', error});
      return next();
    }
  })
};

//función que borra un archivo
const eliminarArchivo = async (req, res, next) => {
try {
  fs.unlinkSync(`uploads/${req.archivo}`);
} catch (error) {
  console.log(error);
  return next();
}
}

//descargar el archivo
const descargar = async (req, res, next) => {
  const {archivo} = req.params
  //obtiene el enlace
  const enlace = Enlace.findOne({nombre: archivo});
  
  const archivoDescargas = 'uploads/' + archivo;
  res.download(archivoDescargas);

  //eliminar el archivo y la entrada de la BD
  //si las descargas son iguales a 1 => borrar la entrada y borrar el archivo
  const {descargas, nombre} = enlace;
  if(descargas === 1) {
    
    //eliminar el archivo
    req.archivo = nombre;
    //eliminar la url de la BD
    await Enlace.findOneAndRemove(enlace.id);
    next(); //para que se pase al siguiente middleware
  } else {
    //si las descargas son > a 1 => restar -1
    enlace.descargas --;
    await enlace.save();
  }
}

export {
  subirArchivo,
  eliminarArchivo,
  descargar
}