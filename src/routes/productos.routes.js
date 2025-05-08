import { Router } from 'express';
import { 
  obtenerProductos, 
  obtenerProductoPorId, 
  registrarProducto, 
  eliminarProducto,
  actualizarProducto 
} from '../controllers/productos.controller.js';

const router = Router();

router.get('/productos', obtenerProductos);
router.get('/productos/:id', obtenerProductoPorId);
router.post('/productos', registrarProducto);
router.delete('/productos/:id', eliminarProducto);
router.put('/productos/:id', actualizarProducto);

export default router;