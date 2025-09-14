import express from 'express';
import logger from '#config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from '#routes/auth.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  morgan('combined', {
    stream: {
      write: message => {
        logger.info(message.trim());
      },
    },
  })
);

app.get('/', (req, res) => {
  logger.info('Hello from acquistions');
  res.status(200).send('Hello from acquistions');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    status: 'OK',
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Acquistions API is running',
  });
});

app.use('/api/auth', authRouter);

export default app;
