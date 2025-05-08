import { pool } from '../db.js';

// Obtener todas las ventas con detalles
export const obtenerVentasConDetalles = async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT 
        v.id_venta,
        dv.id_detalle_venta,
        v.fecha,
        c.nombre AS nombre_cliente,
        e.nombre AS nombre_empleado,
        p.nombreProducto AS nombre_producto,
        dv.Cantidad,
        dv.subtotal
      FROM venta v
      INNER JOIN detalle_venta dv ON v.id_venta = dv.id_venta
      INNER JOIN producto p ON dv.id_producto = p.id_producto
      INNER JOIN cliente c ON v.id_cliente = c.id_cliente
      INNER JOIN empleado e ON v.id_empleado = e.id_empleado
    `);

    res.json(result);
  } catch (error) {
    console.error('Error en obtenerVentasConDetalles:', error);
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos de las ventas.',
    });
  }
};
