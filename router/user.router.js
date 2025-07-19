import express from 'express';

const router =express.Router();

//to link controller on router file
import * as userController from '../controller/user.controller.js';

router.post("/save",userController.save);
router.get("/fetch",userController.fetch);
router.post('/login', userController.login);
router.put('/update-profile',userController.updateProfile);

export default router;