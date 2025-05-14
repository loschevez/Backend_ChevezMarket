import express from 'express';
import cors from 'cors';
import rutasClientes from './routes/clientes.routes.js';
import rutasUsuarios from './routes/usuarios.routes.js';
import rutasProductos from './routes/productos.routes.js';
import rutasProveedores from './routes/proveedores.routes.js';
import rutasCompras from './routes/compras.routes.js';
import rutasVentas from './routes/ventas.routes.js';
import rutasTipos from './routes/tipo.routes.js';

const app = express();

// Habilitar CORS para cualquier origen
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Rutas
app.use('/api', rutasClientes);
app.use('/api', rutasUsuarios);
app.use('/api', rutasProductos);
app.use('/api', rutasProveedores);
app.use('/api', rutasVentas);
app.use('/api', rutasCompras);
app.use('/api', rutasTipos);

app.use(express.json({ limit: '10mb' })); // Aumenta a 10 MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        message: `La ruta ${req.method} ${req.originalUrl} no se encuentra registrada.`
    });
});

export default app;