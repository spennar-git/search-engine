import express from 'express';
import { login } from '../controllers/auth.controllers.js';
import { getWebsites, addWebsite, approveWebsite, deleteWebsite } from '../controllers/admin.controller.js';
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route for admin login
router.post('/login', login);

// Protected routes
router.get('/websites', authenticateToken, getWebsites);
router.post('/websites', authenticateToken, addWebsite);
router.put('/websites/:id/approve', authenticateToken, approveWebsite);
router.delete('/websites/:id', authenticateToken, deleteWebsite);

export default router;
