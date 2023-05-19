import { Router } from 'express';
import { getHomePage } from '../controllers/index.js';

export const router = new Router();

router.get('/', getHomePage);
