import { Router } from 'express';
import { obtenerProveedores, obtenerProveedorPorId, registrarProveedor } from '../controllers/proveedores.controller.js';


const router = Router();

// Ruta para obtener todos los proveedores
router.get('/proveedores', obtenerProveedores);

// Ruta para obtener un proveedor por su ID
router.get('/proveedor/:id', obtenerProveedorPorId);

// Ruta para registrar un nuevo proveedor
router.post('/proveedor', registrarProveedor);

export default router;
