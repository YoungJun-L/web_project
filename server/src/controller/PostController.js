import express from 'express';
import * as PostService from '../service/PostService';

const router = express.Router();
router.get('/main', PostService.getMain);
router.get('/all', PostService.getAll);

export default router;
