import { Router } from 'express';
import { logoutAction } from '../controllers/index.js';

export const router = new Router();

router.get('/', logoutAction);
