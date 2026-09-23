import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import refugioRoutes from './routes/refugio.routes';
import publicacionAdopcionRoutes from './routes/publicacionAdopcion.routes';
import reporteMascotaRoutes from './routes/reporteMascota.routes';
import { errorHandler } from './middleware/errorHandler.middleware';

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

app.use(errorHandler);

export default app;