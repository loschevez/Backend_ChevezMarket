import { pool } from '../db.js';

// Obtener todos los tipos
export const obtenerTipos = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM tipo');
    res.json(result);
  } catch (error) {
    console.error('Error en obtenerTipos:', error);
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos de los tipos.',
    });
  }
};

// Eliminar un tipo
export const eliminarTipo = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM tipo WHERE id_tipo = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Tipo no encontrado' });
    }
    res.json({ mensaje: 'Tipo eliminado correctamente' });
  } catch (error) {
    console.error('Error en eliminarTipo:', error);
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al eliminar el tipo.',
    });
  }
};

// Actualizar un tipo
export const actualizarTipo = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo } = req.body;
    const [result] = await pool.query(
      'UPDATE tipo SET tipo = ? WHERE id_tipo = ?',
      [tipo, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Tipo no encontrado' });
    }
    res.json({ mensaje: 'Tipo actualizado correctamente' });
  } catch (error) {
    console.error('Error en actualizarTipo:', error);
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al actualizar el tipo.',
    });
  }
};


// Registrar un nuevo tipo
export const registrarTipo = async (req, res) => {
  try {
    const { tipo } = req.body; // Se espera que el frontend envíe { tipo: "nombre" }
    const [result] = await pool.query(
      'INSERT INTO tipo (tipo) VALUES (?)',
      [tipo]
    );
    res.status(201).json({ id_tipo: result.insertId });
  } catch (error) {
    console.error('Error en registrarTipo:', error);
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al registrar el tipo.',
    });
  }
};
