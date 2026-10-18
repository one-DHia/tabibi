import express from 'express';
import cors from 'cors';
import path from 'path';
import { ENV } from './config/env.js';
import { bookingRouter } from './routes/booking.routes.js';
import { cabinetRouter } from './routes/cabinet.routes.js';
import { startReminderScheduler } from './services/reminderScheduler.js';

const app = express();

app.use(cors());
app.use(express.json());

// Serve static frontend assets from both dist/client and src/client
app.use(express.static(path.join(process.cwd(), 'dist', 'client')));
app.use(express.static(path.join(process.cwd(), 'src', 'client')));
app.use('/i18n', express.static(path.join(process.cwd(), 'dist', 'i18n')));
app.use('/i18n', express.static(path.join(process.cwd(), 'src', 'i18n')));
app.use('/types', express.static(path.join(process.cwd(), 'dist', 'types')));
app.use('/types', express.static(path.join(process.cwd(), 'src', 'types')));

// API routes
app.use(bookingRouter);
app.use(cabinetRouter);

const clientDir = path.join(process.cwd(), 'src', 'client');

// Page: Home
app.get('/', (_req, res) => {
  res.sendFile(path.join(clientDir, 'home', 'index.html'));
});

// Page: Auth (login, signup, reset password)
app.get(['/login', '/signup', '/forgot-password', '/reset-password'], (_req, res) => {
  res.sendFile(path.join(clientDir, 'auth', 'index.html'));
});

// Page: Doctor Dashboard
app.get('/dashboard', (_req, res) => {
  res.sendFile(path.join(clientDir, 'dashboard', 'index.html'));
});

// Page: WhatsApp Single-Use Appointment Tracking
app.get('/r/:token', (_req, res) => {
  res.sendFile(path.join(clientDir, 'appointment', 'index.html'));
});

// Pages: Institutional & Legal
app.get(['/about', '/privacy', '/terms', '/cookies'], (_req, res) => {
  res.sendFile(path.join(clientDir, 'legal', 'index.html'));
});

// Page: Dedicated Cabinet Booking Page
app.get('/:slug', (req, res, next) => {
  if (req.params.slug.startsWith('api') || req.params.slug.includes('.')) {
    return next();
  }
  res.sendFile(path.join(clientDir, 'booking', 'index.html'));
});

startReminderScheduler();

const PORT = Number(ENV.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`[Tabibi] Server running on http://localhost:${PORT}`);
});

export default app;
