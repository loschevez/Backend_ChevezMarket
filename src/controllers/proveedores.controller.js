import { pool } from '../db.js';

// Obtener todos los proveedores
export const obtenerProveedores = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM proveedor');
    res.json(result);
  } catch (error) {
    console.error('Error en obtenerProveedores:', error);
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos de los proveedores.',
    });
  }
};

// Obtener un proveedor por su ID
export const obtenerProveedorPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('SELECT * FROM proveedor WHERE id_proveedor = ?', [id]);
    
    if (result.length === 0) {
      return res.status(404).json({
        mensaje: `El proveedor con ID ${id} no fue encontrado.`
      });
    }
    
    res.json(result[0]);
  } catch (error) {
    console.error('Error en obtenerProveedorPorId:', error);
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos del proveedor.',
    });
  }
};

// Registrar un nuevo proveedor
export const registrarProveedor = async (req, res) => {
  try {
    const { nombre, direccion, telefono, email } = req.body;

    const [result] = await pool.query(
      'INSERT INTO proveedor (nombre, direccion, telefono, email) VALUES (?, ?, ?, ?)',
      [nombre, direccion, telefono, email]
    );

    res.status(201).json({ id_proveedor: result.insertId });
  } catch (error) {
    console.error('Error en registrarProveedor:', error);
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al registrar el proveedor.',
    });
  }
};
