import express from 'express';
import { subscribe, confirm } from '../../controllers/newsletter.controller.js';

const router = express.Router();

router.post('/subscribe', subscribe);
router.get('/confirm', confirm);

export default router;