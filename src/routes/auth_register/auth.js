import express from 'express';
import {
    getAuthorization,
    postAuthorization,
} from '../../controllers/index.js';

export const router = express.Router();

router.get('/', getAuthorization);
router.post('/', postAuthorization);
