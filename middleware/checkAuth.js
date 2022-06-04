import  jwt  from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

//verifica que el usuario este registrado
const checkAuth = async (req, res, next) => {
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = await Usuario.findById(decoded.id).select("-password -createdAt -updatedAt -__v");
      return next();
    } catch (error) {
      return res.status(404).json({msg: "Token no válido o el token expiró, vuelve a iniciar sesión"});
    }
  }
  if(!token) {
    const error = new Error("Token no válido");
    return res.status(401).json({msg: error.message});
  }
next();
};

export default checkAuth;