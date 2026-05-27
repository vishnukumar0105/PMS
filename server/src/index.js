import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import masterListRoutes from './routes/masterList.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_, res) => res.json({ ok: true }));
app.use('/api/hr', masterListRoutes);

const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
