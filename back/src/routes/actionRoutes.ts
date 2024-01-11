import { Router } from 'express';
import { getAllActions, addAction, initUpdate, updateAction } from '../controllers/actionsController';

const router = Router();

router.get('/actions', getAllActions);
router.post('/update-action', updateAction);
router.post('/init-update', initUpdate);
router.post('/add-action', addAction)

export default router;
