import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';

const checkAuth = async (req, res, next) => {
    const {authorization}= req.headers;
    if(authorization && authorization.startsWith('Bearer')){
        let token;
        token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado");
        return next();
    }

    if(!token){
        const error = new Error('Token no valido o inexistente');
        res.json(403).json({msg: error.messsage});
    }

    next();
}

export default checkAuth;