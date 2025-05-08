import { Router } from 'express';
import { 
  obtenerCompras, 
  obtenerCompraPorId, 
  crearCompra, 
  actualizarCompra, 
  eliminarCompra 
} from '../controllers/compras.controller.js';

const router = Router();

router.get('/compras', obtenerCompras);
router.get('/compras/:id', obtenerCompraPorId);
router.post('/compras', crearCompra);
router.put('/compras/:id', actualizarCompra);
router.delete('/compras/:id', eliminarCompra);

export default router;