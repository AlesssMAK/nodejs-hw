import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { connectMongoDB } from './db/connectMongoDB.js';
import { errors } from 'celebrate';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT ?? 3030;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(cookieParser());

app.use(authRoutes);
app.use(notesRoutes);
app.use(userRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
