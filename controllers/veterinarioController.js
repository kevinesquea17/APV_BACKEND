import Veterinario from "../models/Veterinario.js";
import generarJWT from '../helpers/generarJWT.js';
import generarToken from "../helpers/generarToken.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
    
    //Prevenir usuarios duplicados
    const {email, nombre} = req.body;
    const existeVeterinario = await Veterinario.findOne({email});
    if(existeVeterinario){
        const error = new Error("Usuario ya registrado")
        return res.status(403).json({msg : error.message});
    }
    
    try {
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //Enviar Email con nodemailer
        emailRegistro({
            nombre,
            email,
            token: veterinarioGuardado.token
        });

        res.status(200).json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    }
}


const confirmar = async (req, res) => {
   const {token} = req.params;
   const usuarioConfirmar = await Veterinario.findOne({token});

   if(!usuarioConfirmar){
       const error = new Error("Token no valido");
       return res.status(403).json({msg: error.message});
   }

   try {
       usuarioConfirmar.token = null;
       usuarioConfirmar.confirmado = true;
       await usuarioConfirmar.save();
       res.status(200).json({msg: "Cuenta confirmada correctamente"})
   } catch (error) {
       console.log(error);
   }
}


const autenticar =  async (req, res) => {
    const {email, password} = req.body;
    const existeVeterinario =  await Veterinario.findOne({email});
    
    if(!existeVeterinario){
        const error = new Error("El usuario no existe");
        return res.status(403).json({msg: error.message});
    }

    if(!existeVeterinario.confirmado){
        const error = new Error("Su cuenta aun no ha sido confirmada");
        return res.status(403).json({msg: error.message});  
    }

    //Comprobar password
    if(await existeVeterinario.comprobarPassword(password)){
        //autenticar con JSON web token 
        res.json({
            _id: existeVeterinario._id,
            nombre: existeVeterinario.nombre,
            email: existeVeterinario.email,
            token: generarJWT(existeVeterinario.id)
        }); 
    }else{
        const error = new Error("El password es incorrecto");
        return res.status(403).json({msg: error.message}); 
    }
}


const perfil = (req, res) => {
    const {veterinario} = req;
    res.json(veterinario);
}

const olvidePassword = async (req, res) => {
    const {email} = req.body;

    const existeVeterinario = await Veterinario.findOne({email});
    if(!existeVeterinario){
        const error = new Error("El usuario no existe");
        return res.status(403).json({msg: error.message});
    }

    try {
        existeVeterinario.token = generarToken();
        await existeVeterinario.save();
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })
        res.status(200).json({msg: "Hemos enviado las instrucciones a tu e-mail"});
    } catch (error) {
        res.status(500).json(error);
    }

}

const reestablecerPassword = async (req, res) => {
    const {token} = req.params;

    const veterinario = await Veterinario.findOne({token});
    if(veterinario){
        res.status(200).json({msg: 'token valido'});
    }else{
        const error = new Error("Token no valido");
        return res.status(403).json({msg: error.message});
    }

}

const nuevoPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token});

    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

   try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.status(200).json({msg: "password modificado correctamente"});
   } catch (error) {
       res.status(500).json(error);
   }
}

export {
    registrar, confirmar, autenticar, perfil, olvidePassword, reestablecerPassword, nuevoPassword  
};