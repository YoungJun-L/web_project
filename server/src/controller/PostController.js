import express from 'express';
import * as PostService from '../service/PostService';

const router = express.Router();
router.get('/', (req, res, next) => {
  res.render('index.html');
});
router.get('/list', (req, res, next) => {
  res.render('list.html');
});
router.get('/main', PostService.getMain);
router.get('/all', PostService.getAll);

export default router;
