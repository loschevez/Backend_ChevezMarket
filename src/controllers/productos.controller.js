import { pool } from '../db.js';

// Obtener todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT 
        id_producto, 
        nombre_producto, 
        Precio_U, 
        Cantidad, 
        id_tipo 
      FROM 
        producto
    `);
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los productos.',
      error: error.message
    });
  }
};

// Obtener un producto por su ID
export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(`
      SELECT 
        id_producto, 
        nombre_producto, 
        Precio_U, 
        Cantidad, 
        id_tipo 
      FROM 
        producto 
      WHERE 
        id_producto = ?
    `, [id]);
    
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: `El producto con ID ${id} no fue encontrado.`
      });
    }
    
    res.json(result[0]);
  } catch (error) {
    console.error('Error en obtenerProductoPorId:', error);
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos del producto.',
    });
  }
};

// Registrar un nuevo producto
export const registrarProducto = async (req, res) => {
  try {
    const { nombre_producto, descripcion, Precio_U, cantidad, id_tipo } = req.body;

    const [result] = await pool.query(
      'INSERT INTO producto (nombre_producto, Precio_U, cantidad, id_tipo) VALUES (?, ?, ?, ?, ?)',
      [nombre_producto, descripcion, Precio_U, cantidad, id_tipo]
    );

    res.status(201).json({ id_producto: result.insertId });
  } catch (error) {
    console.error('Error en registrarProducto:', error);
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al registrar el producto.',
    });
  }
};

// Eliminar un producto por su ID
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM producto WHERE id_producto = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        mensaje: `El producto con ID ${id} no fue encontrado.`
      });
    }

    res.json({ mensaje: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error en eliminarProducto:', error);
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al eliminar el producto.',
      error: error.message
    });
  }
};

// Actualizar un producto
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_producto, Precio_U, Cantidad, id_tipo } = req.body;
    const [result] = await pool.query(
      'UPDATE producto SET nombre_producto = ?, Precio_U = ?, Cantidad = ?, id_tipo = ? WHERE id_producto = ?',
      [nombre_producto, Precio_U, Cantidad, id_tipo, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto actualizado exitosamente' });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al actualizar el producto.',
      error: error.message
    });
  }
};