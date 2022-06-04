import mongoose from "mongoose";
import bcrypt from "bcrypt";

const enlaceSchema = mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true,
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  nombre_original:{
    type: String,
    required: true,
    trim: true,
  },
  descargas: {
    type: Number,
    default: 1,
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null,
  },
  password: {
    type: String,
    default: null,
  },
  creado: {
    type: Date,
    default: Date.now(),
  },
}, {
  timestamps: true
});

//función que encripta el password del usuario
enlaceSchema.pre('save', async function(next) {
  //revisa que el password no haya sido hasheado anteriormente
  if(!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Enlace = mongoose.model("Enlace", enlaceSchema);

export default Enlace;