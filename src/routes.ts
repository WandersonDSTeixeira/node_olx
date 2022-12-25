import { Router, Request, Response } from "express";
import { user } from "./controllers/UserController";
import { auth } from "./controllers/AuthController";
import { ad } from "./controllers/AdsController";

const router = Router();

router.get('/ping', (req: Request, res: Response) => {
    res.json({ pong: true });
});

router.get('/states', user.getStates);

router.post('/user/signin', auth.signin);
router.post('/user/signup', auth.signup);

router.get('/user/me', user.info);
router.put('/user/me', user.edit);

router.get('/categories', ad.getCategories);

router.post('/ad/add', ad.add);
router.get('/ad/list', ad.getList);
router.get('/ad/:id', ad.getAd);
router.post('/ad/:id', ad.edit);

export default router;