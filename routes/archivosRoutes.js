import express from "express";
import checkAuth from "../middleware/checkAuth.js";
const router = express.Router();



import {
  subirArchivo,
  descargar,
  eliminarArchivo
} from "../controllers/archivosController.js";

router.post("/", checkAuth, subirArchivo); //sube un archivo

router.get('/:archivo', descargar, eliminarArchivo )

export default router;