import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import refugioRoutes from './routes/refugio.routes';
import publicacionAdopcionRoutes from './routes/publicacionAdopcion.routes';
import reporteMascotaRoutes from './routes/reporteMascota.routes';
import { errorHandler } from './middleware/errorHandler.middleware';
import imagenRoutes from './routes/imagen.routes';
import comentarioRoutes from './routes/comentario.routes';
import donacionRoutes from './routes/donacion.routes';
import guiaRescateRoutes from './routes/guiaRescate.routes';
import solicitudAdopcionRoutes from './routes/solicitudAdopcion.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/refugios', refugioRoutes);
app.use('/api/publicaciones', publicacionAdopcionRoutes);
app.use('/api/reportes', reporteMascotaRoutes);
app.use('/api/imagenes', imagenRoutes);
app.use('/api/comentarios', comentarioRoutes);
app.use('/api/donaciones', donacionRoutes);
app.use('/api/guias', guiaRescateRoutes);
app.use('/api/solicitudes', solicitudAdopcionRoutes);

app.use(errorHandler);

export default app;