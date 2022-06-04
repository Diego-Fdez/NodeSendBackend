import express from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import enlacesRoutes from "./routes/enlacesRoute.js";
import archivosRoutes from "./routes/archivosRoutes.js";
import cors from "cors";

//crear servidor
const app = express();
//habilitar leer los valores de un body
app.use(express.json());

//leer los archivos .env
dotenv.config();

//configurar cors
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function(origin, callback) {
    if(whitelist.includes(origin)) {
      //Puede consultar la API
      callback(null, true);
    } else {
      //No esta Permitido
      callback(new Error("Error de Cors"));
    }
  }
};

app.use(cors(corsOptions));

//conectar a la BD
conectarDB();

//Puerto de la app
const port = process.env.PORT || 4000;

//habilitar carpeta publica
app.use(express.static('uploads'));

//Routing
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/enlaces", enlacesRoutes);
app.use("/api/archivos", archivosRoutes);

//arrancar la app
app.listen(port, "0.0.0.0", () => {
  console.log("Servidor funcionando");
})