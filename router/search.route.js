import express from 'express';
import { getTravelData } from '../controller/search.controller.js';

const router = express.Router();

router.post('/get-data', getTravelData);

export default router;
