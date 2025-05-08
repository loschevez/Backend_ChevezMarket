import { pool } from '../db.js';

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Usuarios');
    res.json(result);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos de los usuarios.',
      error: error.message
    });
  }
};

// Obtener un usuario por su Nombre_Usuario
export const obtenerUsuario = async (req, res) => {
  try {
    const { user } = req.params;
    const [result] = await pool.query('SELECT * FROM Usuarios WHERE Nombre_Usuario = ?', [user]);
    
    if (result.length <= 0) {
      return res.status(404).json({
        mensaje: `Error al leer los datos. El usuario ${user} no fue encontrado.`
      });
    }
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al leer los datos del usuario.',
      error: error.message
    });
  }
};

// Verificar si un usuario existe y si la contraseña es correcta
export const verificarUsuario = async (req, res) => {
  try {
    const { Nombre_Usuario, Contraseña } = req.body;
    
    if (!Nombre_Usuario || !Contraseña) {
      return res.status(400).json({
        mensaje: 'Faltan parámetros: Nombre_Usuario y Contraseña son requeridos.'
      });
    }

    // Buscar el usuario en la base de datos por Nombre_Usuario
    const [result] = await pool.query(
      'SELECT * FROM Usuarios WHERE Nombre_Usuario = ?',
      [Nombre_Usuario]
    );

    if (result.length === 0) {
      // Usuario no encontrado
      return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado.' });
    }

    const usuario = result[0];

    // Comparar la contraseña como texto plano
    if (Contraseña === usuario.Contraseña) {
      const { Contraseña, ...usuarioSinPassword } = usuario;
      return res.json({ success: true, usuario: usuarioSinPassword });
    } else {
      return res.status(401).json({ success: false, mensaje: 'Contraseña incorrecta.' });
    }
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error al verificar el usuario.',
      error: error.message
    });
  }
};
