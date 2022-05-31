import express from 'express';
const router = express.Router(); 
import { registrar,
    confirmar, 
    autenticar, 
    perfil,
    olvidePassword,
    reestablecerPassword,
    nuevoPassword } from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';

router.post('/', registrar);
router.get('/confirmar/:token', confirmar)
router.post('/login', autenticar);
router.post('/olvide-password', olvidePassword);
router.get('/reestablecer-password/:token', reestablecerPassword);
router.post('/reestablecer-password/:token', nuevoPassword)

router.get('/perfil', checkAuth, perfil);

export default router;