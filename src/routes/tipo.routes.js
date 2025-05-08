import { Router } from 'express';
import { obtenerTipos, registrarTipo, eliminarTipo, actualizarTipo } from '../controllers/tipo.controller.js';

const router = Router();

// Ruta para obtener todos los tipos
router.get('/obtenerTipos', obtenerTipos);

// Ruta para registrar un nuevo tipo
router.post('/tipo', registrarTipo);

// Ruta para eliminar un tipo
router.delete('/tipo/:id', eliminarTipo);

// Ruta para actualizar un tipo
router.put('/tipo/:id', actualizarTipo);


export default router;
