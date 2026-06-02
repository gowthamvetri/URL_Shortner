import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Route imports
import authRoutes from './routes/auth.routes.js';
import urlRoutes from './routes/url.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import redirectRoutes from './routes/redirect.routes.js';
import dbConnect from './config/dbconfig.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

const PORT = process.env.PORT || 5000;

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', apiLimiter);

// General Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Trust proxy if we are behind a reverse proxy (e.g., Heroku, Nginx)
app.set('trust proxy', 1);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

// Redirect Route (Root level)
// Place this last so it doesn't catch /api routes
app.use('/', redirectRoutes);


// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);  
});

export default app;
