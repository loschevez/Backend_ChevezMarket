import { pool } from '../db.js';

// Obtener todos los clientes
export const obtenerClientes = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM cliente');
    res.json(result);
  } catch (error) {
    console.error('Error en obtenerClientes:', error);
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos de los clientes.',
    });
  }
};

// Registrar un nuevo cliente
export const registrarCliente = async (req, res) => {
  try {
    const { nombre, apellido, cedula, email, telefono } = req.body;
    const [result] = await pool.query(
      'INSERT INTO cliente (nombre, apellido, cedula, email, telefono) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, cedula, email, telefono]
    );
    res.status(201).json({ id_cliente: result.insertId });
  } catch (error) {
    console.error('Error en registrarCliente:', error);
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al registrar el cliente.',
    });
  }
};

// Eliminar un cliente
export const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM cliente WHERE id_cliente = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error en eliminarCliente:', error);
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al eliminar el cliente.',
    });
  }
};

// Actualizar un cliente
export const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, cedula, email, telefono } = req.body;
    const [result] = await pool.query(
      'UPDATE cliente SET nombre = ?, apellido = ?, cedula = ?, email = ?, telefono = ? WHERE id_cliente = ?',
      [nombre, apellido, cedula, email, telefono, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json({ mensaje: 'Cliente actualizado correctamente' });
  } catch (error) {
    console.error('Error en actualizarCliente:', error);
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al actualizar el cliente.',
    });
  }
};