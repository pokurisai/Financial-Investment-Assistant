const express = require('express')
const router = express.Router()
const { UserController, AuthenticationController } = require('../controllers');

router.post('/register/user', UserController.registerUser)
router.post('/login', AuthenticationController.isLocalAuthenticated, UserController.loginUser);
router.get('/users/data', AuthenticationController.isBearerAuthenticated, UserController.getAllUsers)
router.post('/admin/login', AuthenticationController.isLocalAuthenticated, UserController.loginAdminUser)
router.post("/upload",  AuthenticationController.isBearerAuthenticated, UserController.upload);
router.get("/files", UserController.getListFiles);
router.get("/files/:name", UserController.download);
router.get("/activate/user/:id",  AuthenticationController.isBearerAuthenticated, UserController.updateUserAccount);
router.post("/password/change",  AuthenticationController.isBearerAuthenticated, UserController.userPasswordChange);
router.post("/update/user",  AuthenticationController.isBearerAuthenticated, UserController.updateUser);
router.get("/user/portfolio",  AuthenticationController.isBearerAuthenticated, UserController.userPortfolio);

module.exports = router;
