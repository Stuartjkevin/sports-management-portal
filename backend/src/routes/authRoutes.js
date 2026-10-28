import { Router } from 'express';
import { changePassword, getMe, login, register, updateMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);
router.put('/me/password', authenticate, changePassword);

export default router;
