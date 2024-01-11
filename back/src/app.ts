import express from 'express';
import cors from 'cors';
import actionRoutes from './routes/actionRoutes';

export const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/', actionRoutes);

export default app;
