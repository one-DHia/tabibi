import { Router, Request, Response } from 'express';
import { cancelAppointmentByDoctor } from '../services/bookingService.js';

export const cabinetRouter = Router();

cabinetRouter.post('/api/cabinet/appointments/:id/cancel', (req: Request, res: Response) => {
  const id = String(req.params.id);
  const success = cancelAppointmentByDoctor(id);

  if (!success) {
    res.status(404).json({ success: false, error: 'Rendez-vous introuvable' });
    return;
  }

  res.json({ success: true, message: 'Rendez-vous annulé et créneau libéré en temps réel' });
});
