import { pool } from '../db.js';

export const registrarProducto = async (req, res) => {
  try {
    const { nombre_producto, Precio_U, Cantidad, id_tipo } = req.body;

    // Validaciones
    if (!nombre_producto || !Precio_U || !Cantidad || !id_tipo) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }
    if (Precio_U < 0 || Cantidad < 0) {
      return res.status(400).json({ mensaje: 'El precio unitario y la cantidad no pueden ser negativos.' });
    }

    const [result] = await pool.query(
      'INSERT INTO producto (nombre_producto, Precio_U, Cantidad, id_tipo, activo) VALUES (?, ?, ?, ?, 1)',
      [nombre_producto, Precio_U, Cantidad, id_tipo]
    );

    res.status(201).json({ id_producto: result.insertId });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ mensaje: 'El id_tipo proporcionado no existe.' });
    }
    console.error('Error en registrarProducto:', error);
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al registrar el producto.',
    });
  }
};

export const obtenerProductos = async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT p.id_producto, p.nombre_producto, p.Precio_U, p.Cantidad, t.tipo AS nombre_tipo
      FROM producto p
      JOIN tipo t ON p.id_tipo = t.id_tipo
      WHERE p.activo = 1
    `);
    res.json(result);
  } catch (error) {
    console.error('Error en obtenerProductos:', error);
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos de los productos.',
    });
  }
};

export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(`
      SELECT p.id_producto, p.nombre_producto, p.Precio_U, p.Cantidad, p.id_tipo, t.tipo AS nombre_tipo
      FROM producto p
      JOIN tipo t ON p.id_tipo = t.id_tipo
      WHERE p.id_producto = ? AND p.activo = 1
    `, [id]);
    if (result.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error('Error en obtenerProductoPorId:', error);
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al obtener el producto.',
    });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('UPDATE producto SET activo = 0 WHERE id_producto = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto desactivado correctamente' });
  } catch (error) {
    console.error('Error en eliminarProducto:', error);
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al desactivar el producto.',
    });
  }
};

export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_producto, Precio_U, Cantidad, id_tipo } = req.body;

    // Validaciones
    if (!nombre_producto || !Precio_U || !Cantidad || !id_tipo) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }
    if (Precio_U < 0 || Cantidad < 0) {
      return res.status(400).json({ mensaje: 'El precio y la cantidad no pueden ser negativos.' });
    }

    const [result] = await pool.query(
      'UPDATE producto SET nombre_producto = ?, Precio_U = ?, Cantidad = ?, id_tipo = ? WHERE id_producto = ? AND activo = 1',
      [nombre_producto, Precio_U, Cantidad, id_tipo, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto actualizado correctamente' });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ mensaje: 'El id_tipo proporcionado no existe.' });
    }
    console.error('Error en actualizarProducto:', error);
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al actualizar el producto.',
    });
  }
};