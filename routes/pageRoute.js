import express from "express";
import * as pageController from "../controllers/pageController.js";
import * as userController from "../controllers/userController.js";

import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(
  authMiddleware.checkUser, // Kullanıcı oturum kontrolü
  authMiddleware.authenticateToken, // Token doğrulama
  pageController.getIndexPage // Index sayfasını gösterme
);
router.route("/about").get(
  authMiddleware.checkUser, // Kullanıcı oturum kontrolü
  authMiddleware.authenticateToken, // Token doğrulama
  pageController.getAboutPage
);

router.route("/register").get(pageController.getRegisterPage);
router.route("/login").get(pageController.getLoginPage);
router.route("/logout").get(pageController.getLogout);
router.route("/contact").get(
  authMiddleware.checkUser, // Kullanıcı oturum kontrolü
  authMiddleware.authenticateToken, // Token doğrulama
  pageController.getContactPage
);
router.route("/contact").post(
  authMiddleware.checkUser, // Kullanıcı oturum kontrolü
  authMiddleware.authenticateToken, // Token doğrulama
  pageController.sendMail
);

router
  .route("/posts")
  .get(
    authMiddleware.checkUser,
    authMiddleware.authenticateToken,
    pageController.getPostsPage
  );

router
  .route("/followers")
  .get(
    authMiddleware.checkUser,
    authMiddleware.authenticateToken,
    pageController.getFollowersPage
  );

router
  .route("/followings")
  .get(
    authMiddleware.checkUser,
    authMiddleware.authenticateToken,
    pageController.getFollowingsPage
  );

router
  .route("/profile")
  .get(
    authMiddleware.checkUser,
    authMiddleware.authenticateToken,
    pageController.getProfilePage
  );

router
  .route("/settings")
  .get(
    authMiddleware.checkUser,
    authMiddleware.authenticateToken,
    pageController.getProfilePage
  );

export default router;
