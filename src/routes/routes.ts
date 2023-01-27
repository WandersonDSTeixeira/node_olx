import { Router, Request, Response } from 'express';
import { userController } from '../controllers/UserController';
import { authController } from '../controllers/AuthController';
import { adsController } from '../controllers/AdsController';
import { validator } from '../validators/validator';
import { privateRoute } from '../middlewares/passport';
import { upload } from '../middlewares/uploadFiles';

const router = Router();

router.get('/ping', (req: Request, res: Response) => {
    res.json({ pong: true });
});

router.post('/user/signup', validator.signup, authController.signup);
router.post('/user/signin', validator.signin, authController.signin);

router.get('/states', userController.getStates);
router.get('/user/me', privateRoute, userController.infoUser);
router.put('/user/me', privateRoute, validator.editUser, userController.editUser);

router.post('/ad/add', privateRoute, upload.array('img', 10), adsController.addAd);
router.get('/ad/ads', adsController.getAds);
router.get('/ad/:id', adsController.getAd);
router.post('/ad/:id', privateRoute, upload.array('img', 10), adsController.editAd);
router.delete('/ad/:id', privateRoute, adsController.deleteAd);
router.get('/categories', adsController.getCategories);

export default router;