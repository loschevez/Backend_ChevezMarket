import { pool } from '../db.js';

// Obtener todas las compras con información del proveedor, productos y detalles
export const obtenerCompras = async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT 
        c.id_compra,
        c.Fecha,
        p.nombre AS nombre_proveedor,
        c.telefono,
        prod.nombre_producto,
        dc.Cantidad,
        prod.Precio_U AS precio_unitario,
        dc.subtotal,
        (SELECT SUM(subtotal) FROM detalle_compra WHERE id_compra = c.id_compra) AS total_compra
      FROM 
        compra c
      INNER JOIN 
        proveedor p ON c.id_proveedor = p.id_proveedor
      LEFT JOIN 
        detalle_compra dc ON c.id_compra = dc.id_compra
      LEFT JOIN 
        producto prod ON dc.id_producto = prod.id_producto
      ORDER BY 
        c.id_compra, prod.nombre_producto;
    `);
    
    // Agrupar los datos en el backend
    const comprasAgrupadas = result.reduce((acc, item) => {
      const {
        id_compra,
        Fecha,
        nombre_proveedor,
        telefono,
        nombre_producto,
        Cantidad,
        precio_unitario,
        total_compra
      } = item;

      if (!acc[id_compra]) {
        acc[id_compra] = {
          id_compra,
          Fecha,
          nombre_proveedor,
          telefono,
          total_compra: total_compra || 0,
          detalles: []
        };
      }

      if (nombre_producto) {
        acc[id_compra].detalles.push({
          nombre_producto,
          Cantidad: Cantidad || 0,
          precio_unitario: precio_unitario || 0
        });
      }

      return acc;
    }, {});

    res.json(Object.values(comprasAgrupadas));
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos de las compras.',
      error: error.message
    });
  }
};

// Obtener una compra por ID con sus detalles
export const obtenerCompraPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [compra] = await pool.query(`
      SELECT 
        c.id_compra,
        c.Fecha,
        p.id_proveedor,
        p.nombre AS nombre_proveedor,
        c.telefono,
        COALESCE(SUM(dc.subtotal), 0) AS total_compra
      FROM 
        compra c
      INNER JOIN 
        proveedor p ON c.id_proveedor = p.id_proveedor
      LEFT JOIN 
        detalle_compra dc ON c.id_compra = dc.id_compra
      WHERE 
        c.id_compra = ?
      GROUP BY 
        c.id_compra, c.Fecha, p.id_proveedor, p.nombre, c.telefono
    `, [id]);

    if (compra.length === 0) {
      return res.status(404).json({ mensaje: 'Compra no encontrada' });
    }

    const [detalles] = await pool.query(`
      SELECT 
        dc.id_detalle_compra,
        dc.id_compra,
        dc.id_producto,
        prod.nombre_producto,
        dc.Cantidad,
        prod.Precio_U AS precio_unitario,
        dc.subtotal
      FROM 
        detalle_compra dc
      INNER JOIN 
        producto prod ON dc.id_producto = prod.id_producto
      WHERE 
        dc.id_compra = ?
    `, [id]);

    res.json({ ...compra[0], detalles });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener la compra.',
      error: error.message,
    });
  }
};

// Crear una nueva compra con detalles (Agregar)
export const crearCompra = async (req, res) => {
  const { id_proveedor, telefono, detalles } = req.body;
  try {
    await pool.query('START TRANSACTION');

    const [compraResult] = await pool.query(
      'INSERT INTO compra (id_proveedor, telefono) VALUES (?, ?)',
      [id_proveedor, telefono]
    );
    const id_compra = compraResult.insertId;

    for (const detalle of detalles) {
      await pool.query(
        'INSERT INTO detalle_compra (id_compra, id_producto, Cantidad, subtotal) VALUES (?, ?, ?, ?)',
        [id_compra, detalle.id_producto, detalle.Cantidad, detalle.subtotal]
      );

      // Actualizar la existencia en la tabla producto
      await pool.query(
        'UPDATE producto SET Cantidad = Cantidad + ? WHERE id_producto = ?',
        [detalle.Cantidad, detalle.id_producto]
      );
    }

    await pool.query('COMMIT');
    res.status(201).json({ mensaje: 'Compra creada exitosamente', id_compra });
  } catch (error) {
    await pool.query('ROLLBACK');
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al crear la compra.',
      error: error.message,
    });
  }
};

// Actualizar una compra existente y sus detalles (Actualizar/Editar)
export const actualizarCompra = async (req, res) => {
  const { id } = req.params;
  const { id_proveedor, telefono, detalles } = req.body;
  try {
    await pool.query('START TRANSACTION');

    await pool.query(
      'UPDATE compra SET id_proveedor = ?, telefono = ? WHERE id_compra = ?',
      [id_proveedor, telefono, id]
    );

    // Obtener los detalles actuales para calcular la diferencia
    const [detallesActuales] = await pool.query(
      'SELECT id_producto, Cantidad FROM detalle_compra WHERE id_compra = ?',
      [id]
    );

    await pool.query('DELETE FROM detalle_compra WHERE id_compra = ?', [id]);

    for (const detalle of detalles) {
      await pool.query(
        'INSERT INTO detalle_compra (id_compra, id_producto, Cantidad, subtotal) VALUES (?, ?, ?, ?)',
        [id, detalle.id_producto, detalle.Cantidad, detalle.subtotal]
      );

      // Calcular la diferencia de cantidad y actualizar la existencia
      const detalleActual = detallesActuales.find(d => d.id_producto === detalle.id_producto);
      const diferencia = (detalleActual ? detalleActual.Cantidad : 0) - detalle.Cantidad;
      await pool.query(
        'UPDATE producto SET Cantidad = Cantidad - ? WHERE id_producto = ?',
        [diferencia, detalle.id_producto]
      );
    }

    await pool.query('COMMIT');
    res.json({ mensaje: 'Compra actualizada exitosamente' });
  } catch (error) {
    await pool.query('ROLLBACK');
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al actualizar la compra.',
      error: error.message,
    });
  }
};

// Eliminar una compra y sus detalles (Borrar)
export const eliminarCompra = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('START TRANSACTION');

    // Obtener los detalles para revertir la existencia
    const [detalles] = await pool.query(
      'SELECT id_producto, Cantidad FROM detalle_compra WHERE id_compra = ?',
      [id]
    );

    await pool.query('DELETE FROM detalle_compra WHERE id_compra = ?', [id]);

    for (const detalle of detalles) {
      await pool.query(
        'UPDATE producto SET Cantidad = Cantidad - ? WHERE id_producto = ?',
        [detalle.Cantidad, detalle.id_producto]
      );
    }

    await pool.query('DELETE FROM compra WHERE id_compra = ?', [id]);

    await pool.query('COMMIT');
    res.json({ mensaje: 'Compra eliminada exitosamente' });
  } catch (error) {
    await pool.query('ROLLBACK');
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al eliminar la compra.',
      error: error.message,
    });
  }
};