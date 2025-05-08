import { Router } from 'express';
import { obtenerClientes, registrarCliente, eliminarCliente, actualizarCliente } from '../controllers/clientes.controller.js';

const router = Router();

// Ruta para obtener todos los clientes
router.get('/clientes', obtenerClientes);

// Ruta para registrar un nuevo cliente
router.post('/clientes', registrarCliente);

// Ruta para eliminar un cliente
router.delete('/clientes/:id', eliminarCliente);

// Ruta para actualizar un cliente
router.put('/clientes/:id', actualizarCliente);

export default router;